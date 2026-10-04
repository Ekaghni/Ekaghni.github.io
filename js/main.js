import * as THREE from 'three';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmall = () => window.innerWidth < 760;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* =========================================================
   1. Launch sequence (first visit in a session)
   ========================================================= */
function runBoot() {
  const boot = document.getElementById('boot');
  let seen = false;
  try { seen = sessionStorage.getItem('ek-launched') === '1'; } catch (e) {}
  if (seen || reduceMotion) { boot.remove(); return Promise.resolve(); }

  document.documentElement.style.overflow = 'hidden';
  const log = document.getElementById('bootLog');
  const count = document.getElementById('bootCount');
  const lines = [
    ['EKAGHNI-01 flight computer', ''],
    ['loading payloads: 7 projects', 'ok'],
    ['deploying satellites: 3 PyPI packages', 'ok'],
    ['indexing academy: 87 lessons, 19 h', 'ok'],
    ['guidance coupled to scroll', 'ok'],
    ['all systems nominal', ''],
  ];
  let cancelled = false;
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  return new Promise(resolve => {
    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      timers.forEach(clearTimeout);
      boot.classList.add('is-done');
      document.documentElement.style.overflow = '';
      try { sessionStorage.setItem('ek-launched', '1'); } catch (e) {}
      setTimeout(() => boot.remove(), 950);
      resolve();
    };
    document.getElementById('bootSkip').addEventListener('click', finish);
    window.addEventListener('keydown', e => { if (e.key === 'Escape') finish(); }, { once: true });

    let t = 0;
    lines.forEach(([txt, ok]) => {
      later(() => {
        const row = document.createElement('div');
        row.textContent = '> ' + txt.padEnd(40, ' ');
        if (ok) { const s = document.createElement('span'); s.className = 'ok'; s.textContent = ok; row.append(s); }
        log.append(row);
      }, t);
      t += 230;
    });
    t += 250;
    ['3', '2', '1'].forEach(n => { later(() => { count.textContent = n; }, t); t += 430; });
    later(() => { count.textContent = ''; boot.classList.add('is-flash'); }, t);
    later(finish, t + 140);
  });
}

/* =========================================================
   2. Shaders
   ========================================================= */
const NOISE = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){float f=0.0;float a=0.5;for(int i=0;i<OCTAVES;i++){f+=a*snoise(p);p*=2.03;a*=0.5;}return f;}
`;

const planetVert = /* glsl */`
varying vec3 vObj; varying vec3 vN; varying vec3 vW;
void main(){
  vObj=position; vN=normalize(mat3(modelMatrix)*normal);
  vec4 w=modelMatrix*vec4(position,1.0); vW=w.xyz;
  gl_Position=projectionMatrix*viewMatrix*w;
}`;

const planetFrag = /* glsl */`
uniform float uTime,uSeed,uFade; uniform int uType;
uniform vec3 uA,uB,uC,uAtmo,uLight;
varying vec3 vObj; varying vec3 vN; varying vec3 vW;
${NOISE}
void main(){
  vec3 p=normalize(vObj);
  vec3 q=p*1.6+uSeed;
  vec3 col;
  if(uType==0){ // banded gas giant
    float n=fbm(vec3(q.x*.7,q.y*5.0,q.z*.7)+vec3(uTime*.015,0.,0.));
    float b=sin(p.y*11.0+n*5.0)*.5+.5;
    col=mix(uA,uB,b); col=mix(col,uC,smoothstep(.35,.9,fbm(q*3.0+n)));
  } else if(uType==1){ // terran
    float n=fbm(q*1.4);
    float land=smoothstep(.02,.1,n);
    col=mix(uA,uB,land); col=mix(col,uC,smoothstep(.25,.6,n)*land);
    col=mix(col,vec3(.95),smoothstep(.78,.9,abs(p.y)));
    float cl=smoothstep(.1,.55,fbm(q*2.6+vec3(uTime*.01,0.,uTime*.006)));
    col=mix(col,vec3(1.),cl*.75);
  } else if(uType==2){ // rocky
    float n=fbm(q*2.2); float m=fbm(q*7.0);
    col=mix(uA,uB,smoothstep(-.3,.4,n)); col=mix(col,uC,smoothstep(.2,.6,m)*.6);
  } else { // ice
    float n=fbm(vec3(q.x*1.2,q.y*3.0,q.z*1.2)+uTime*.006);
    col=mix(uA,uB,smoothstep(-.4,.5,n)); col=mix(col,uC,smoothstep(.3,.7,fbm(q*4.0))*.5);
  }
  vec3 V=normalize(cameraPosition-vW);
  vec3 N=normalize(vN);
  float d=dot(N,normalize(uLight));
  float lit=smoothstep(-.25,.65,d);
  float rim=pow(1.0-max(dot(N,V),0.),2.6);
  vec3 c=col*(.035+lit*1.05)+uAtmo*rim*(.25+lit*.9);
  gl_FragColor=vec4(c*uFade,1.0);
}`;

const atmoFrag = /* glsl */`
uniform vec3 uAtmo,uLight; uniform float uFade;
varying vec3 vObj; varying vec3 vN; varying vec3 vW;
void main(){
  vec3 V=normalize(cameraPosition-vW);
  float i=pow(clamp(.72-dot(normalize(vN),V),0.,1.),3.2);
  float lit=smoothstep(-.4,.6,dot(normalize(vN),normalize(uLight)));
  gl_FragColor=vec4(uAtmo*i*(.3+lit)*2.4*uFade,1.0);
}`;

const ringFrag = /* glsl */`
uniform vec3 uA,uB; uniform float uIn,uOut,uFade;
varying vec3 vObj;
float h(float x){return fract(sin(x*127.1)*43758.5453);}
void main(){
  float r=(length(vObj.xy)-uIn)/(uOut-uIn);
  float b=sin(r*70.0)*.5+.5; float g=h(floor(r*38.0));
  float a=smoothstep(0.,.08,r)*smoothstep(1.,.85,r)*(.25+.55*b*g);
  a*=1.0-smoothstep(.42,.47,r)*smoothstep(.53,.48,r);
  vec3 c=mix(uA,uB,r);
  gl_FragColor=vec4(c*a*uFade,a*uFade);
}`;

const nebulaFrag = /* glsl */`
uniform float uTime,uShift; varying vec3 vObj;
${NOISE}
void main(){
  vec3 d=normalize(vObj);
  float n1=fbm(d*1.9+vec3(0.,0.,uTime*.004));
  float n2=fbm(d*3.6+vec3(7.3,1.1,uTime*.003));
  vec3 voidC=vec3(.018,.026,.075);
  vec3 indigo=vec3(.16,.10,.38);
  vec3 teal=vec3(.10,.52,.62);
  vec3 amber=vec3(.95,.55,.22);
  vec3 c=voidC;
  c+=indigo*smoothstep(-.1,.8,n1)*.55;
  c+=teal*pow(max(n2,0.),1.8)*.42*(1.0-uShift*.4);
  c+=amber*pow(max(n1*n2*2.2,0.),1.6)*(.18+uShift*.35);
  gl_FragColor=vec4(c,1.0);
}`;

/* =========================================================
   3. Space scene
   ========================================================= */
function createSpace() {
  const canvas = document.getElementById('space');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    document.body.classList.add('no-webgl');
    return null;
  }
  const lowPower = isSmall() || (navigator.hardwareConcurrency || 8) <= 4;
  const octaves = lowPower ? 3 : 5;
  const define = { OCTAVES: octaves };
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.4 : 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x060918, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 4000);
  const light = new THREE.Vector3(-0.6, 0.35, 0.7).normalize();

  // ---- flight path
  const ctrl = [];
  const SEGS = 16, LEN = 4200;
  for (let i = 0; i <= SEGS; i++) {
    const z = -i * (LEN / SEGS);
    ctrl.push(new THREE.Vector3(Math.sin(i * 0.85) * 70, Math.cos(i * 0.62) * 34, z));
  }
  const path = new THREE.CatmullRomCurve3(ctrl, false, 'catmullrom', 0.5);
  const pathLen = path.getLength();
  const UP = new THREE.Vector3(0, 1, 0);
  const frameAt = (u) => {
    const p = path.getPointAt(clamp(u, 0, 1));
    const t = path.getTangentAt(clamp(u, 0, 1)).normalize();
    const r = new THREE.Vector3().crossVectors(t, UP).normalize();
    const up = new THREE.Vector3().crossVectors(r, t).normalize();
    return { p, t, r, up };
  };

  // ---- nebula backdrop
  const nebula = new THREE.Mesh(
    new THREE.SphereGeometry(1800, 48, 32),
    new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vObj;void main(){vObj=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: nebulaFrag, defines: define, side: THREE.BackSide, depthWrite: false,
      uniforms: { uTime: { value: 0 }, uShift: { value: 0 } },
    })
  );
  nebula.renderOrder = -10;
  scene.add(nebula);

  // ---- star tunnel along the path
  const STARS = lowPower ? 3500 : 8000;
  const sPos = new Float32Array(STARS * 3), sCol = new Float32Array(STARS * 3), sSize = new Float32Array(STARS), sPhase = new Float32Array(STARS);
  const palette = [new THREE.Color('#eef0ff'), new THREE.Color('#9fefff'), new THREE.Color('#ffd09a'), new THREE.Color('#c9bcff')];
  for (let i = 0; i < STARS; i++) {
    const u = Math.random() * 1.04 - 0.02;
    const f = frameAt(clamp(u, 0, 1));
    const ang = Math.random() * Math.PI * 2;
    const rad = 30 + Math.pow(Math.random(), 0.7) * 520;
    const v = f.p.clone().addScaledVector(f.r, Math.cos(ang) * rad).addScaledVector(f.up, Math.sin(ang) * rad);
    if (u < 0) v.z += 80 + Math.random() * 300;
    sPos.set([v.x, v.y, v.z], i * 3);
    const c = palette[Math.random() < 0.7 ? 0 : 1 + Math.floor(Math.random() * 3)];
    sCol.set([c.r, c.g, c.b], i * 3);
    sSize[i] = Math.random() < 0.04 ? 3.2 + Math.random() * 2.5 : 0.8 + Math.random() * 1.6;
    sPhase[i] = Math.random() * 6.28;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3));
  starGeo.setAttribute('aSize', new THREE.BufferAttribute(sSize, 1));
  starGeo.setAttribute('aPhase', new THREE.BufferAttribute(sPhase, 1));
  const starMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uBoost: { value: 0 } },
    vertexShader: `attribute float aSize,aPhase;attribute vec3 color;varying vec3 vC;varying float vA;uniform float uTime,uPR,uBoost;
      void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;
      float tw=.65+.35*sin(uTime*1.6+aPhase);vA=tw;vC=color;
      gl_PointSize=aSize*uPR*(260.0/-mv.z)*(1.0+uBoost*.6);gl_PointSize=clamp(gl_PointSize,0.,18.0*uPR);}`,
    fragmentShader: `varying vec3 vC;varying float vA;void main(){vec2 d=gl_PointCoord-.5;float r=length(d);float a=smoothstep(.5,0.,r);a=a*a;gl_FragColor=vec4(vC*a*vA*1.4,1.0);}`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(starGeo, starMat));

  // ---- warp streaks (visible only while flying fast)
  const STREAKS = lowPower ? 300 : 700;
  const lPos = new Float32Array(STREAKS * 6), lEnd = new Float32Array(STREAKS * 2), lDir = new Float32Array(STREAKS * 6);
  for (let i = 0; i < STREAKS; i++) {
    const u = Math.random();
    const f = frameAt(u);
    const ang = Math.random() * Math.PI * 2, rad = 20 + Math.random() * 160;
    const v = f.p.clone().addScaledVector(f.r, Math.cos(ang) * rad).addScaledVector(f.up, Math.sin(ang) * rad);
    lPos.set([v.x, v.y, v.z, v.x, v.y, v.z], i * 6);
    lDir.set([f.t.x, f.t.y, f.t.z, f.t.x, f.t.y, f.t.z], i * 6);
    lEnd.set([0, 1], i * 2);
  }
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
  lGeo.setAttribute('aEnd', new THREE.BufferAttribute(lEnd, 1));
  lGeo.setAttribute('aDir', new THREE.BufferAttribute(lDir, 3));
  const streakMat = new THREE.ShaderMaterial({
    uniforms: { uStretch: { value: 0 } },
    vertexShader: `attribute float aEnd;attribute vec3 aDir;uniform float uStretch;varying float vE;
      void main(){vE=aEnd;vec3 p=position-aDir*aEnd*uStretch;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
    fragmentShader: `uniform float uStretch;varying float vE;void main(){float a=clamp(uStretch/40.0,0.,1.)*(1.0-vE)*.8;gl_FragColor=vec4(vec3(.6,.9,1.)*a,1.0);}`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.LineSegments(lGeo, streakMat));

  // ---- planets
  const PLANETS = {
    hero:  { type: 0, r: 26, a: '#1f6f86', b: '#9feaf2', c: '#ffb35c', atmo: '#7fe7ff', ring: ['#ffcf94', '#7fe7ff'], tilt: 0.42 },
    terra: { type: 1, r: 15, a: '#0b2a63', b: '#2f8f6a', c: '#c9a46a', atmo: '#7fc8ff' },
    mars:  { type: 2, r: 13, a: '#7a2e17', b: '#d0703c', c: '#f2c08a', atmo: '#ff9a5c' },
    ice:   { type: 3, r: 17, a: '#2a5fa8', b: '#c8f3ff', c: '#7fe7ff', atmo: '#9fe9ff' },
    gas:   { type: 0, r: 20, a: '#4b2d86', b: '#c9bcff', c: '#ff9fb3', atmo: '#c9bcff', ring: ['#c9bcff', '#ffb35c'], tilt: -0.3 },
    amber: { type: 0, r: 18, a: '#8a4a12', b: '#ffd59a', c: '#fff2d8', atmo: '#ffb35c' },
  };
  const bodies = [];
  const ringGeoCache = {};
  function makePlanet(key, def) {
    const group = new THREE.Group();
    const uni = {
      uTime: { value: 0 }, uSeed: { value: Math.random() * 10 }, uFade: { value: 1 }, uType: { value: def.type },
      uA: { value: new THREE.Color(def.a) }, uB: { value: new THREE.Color(def.b) }, uC: { value: new THREE.Color(def.c) },
      uAtmo: { value: new THREE.Color(def.atmo) }, uLight: { value: light },
    };
    const body = new THREE.Mesh(new THREE.SphereGeometry(def.r, lowPower ? 48 : 96, lowPower ? 32 : 64),
      new THREE.ShaderMaterial({ vertexShader: planetVert, fragmentShader: planetFrag, uniforms: uni, defines: define }));
    group.add(body);
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(def.r * 1.16, 48, 32),
      new THREE.ShaderMaterial({ vertexShader: planetVert, fragmentShader: atmoFrag, uniforms: uni,
        side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    group.add(atmo);
    if (def.ring) {
      const inn = def.r * 1.45, out = def.r * 2.5;
      const rg = new THREE.Mesh(new THREE.RingGeometry(inn, out, 160, 1),
        new THREE.ShaderMaterial({ vertexShader: `varying vec3 vObj;void main(){vObj=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
          fragmentShader: ringFrag, transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
          uniforms: { uA: { value: new THREE.Color(def.ring[0]) }, uB: { value: new THREE.Color(def.ring[1]) }, uIn: { value: inn }, uOut: { value: out }, uFade: uni.uFade } }));
      rg.rotation.x = Math.PI / 2 - 0.28;
      group.add(rg);
    }
    group.rotation.z = def.tilt || 0.2;
    scene.add(group);
    return { key, group, body, uni, r: def.r, spin: 0.02 + Math.random() * 0.03 };
  }

  // ---- galaxy for the academy
  function makeGalaxy() {
    const N = lowPower ? 9000 : 26000, R = 230;
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), sz = new Float32Array(N);
    const inner = new THREE.Color('#ffcf94'), outer = new THREE.Color('#6fdcf0'), lil = new THREE.Color('#c9bcff');
    for (let i = 0; i < N; i++) {
      const rr = Math.pow(Math.random(), 1.55) * R;
      const arm = (i % 3) / 3 * Math.PI * 2;
      const spin = rr * 0.022;
      const rnd = (s) => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * s * (0.25 + rr / R);
      const x = Math.cos(arm + spin) * rr + rnd(26), z = Math.sin(arm + spin) * rr + rnd(26), y = rnd(9);
      pos.set([x, y, z], i * 3);
      const c = inner.clone().lerp(outer, rr / R);
      if (Math.random() < 0.08) c.lerp(lil, 0.8);
      col.set([c.r, c.g, c.b], i * 3);
      sz[i] = 0.6 + Math.random() * 1.6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(sz, 1));
    const m = new THREE.ShaderMaterial({
      uniforms: { uPR: { value: renderer.getPixelRatio() }, uFade: { value: 1 } },
      vertexShader: `attribute float aSize;attribute vec3 color;varying vec3 vC;uniform float uPR;
        void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;vC=color;gl_PointSize=clamp(aSize*uPR*(240.0/-mv.z),0.,10.0*uPR);}`,
      fragmentShader: `varying vec3 vC;uniform float uFade;void main(){float r=length(gl_PointCoord-.5);float a=smoothstep(.5,0.,r);gl_FragColor=vec4(vC*a*.85*uFade,1.0);}`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(g, m);
    const grp = new THREE.Group();
    grp.add(pts);
    // bright core
    const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('#ffd9a8'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    core.scale.set(170, 170, 1);
    grp.add(core);
    grp.rotation.x = 0.32;
    scene.add(grp);
    return { group: grp, points: pts, mat: m, core };
  }

  function glowTexture(color) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, color); grd.addColorStop(0.18, color + 'cc'); grd.addColorStop(0.45, color + '33'); grd.addColorStop(1, color + '00');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }

  // ---- the home star for contact
  function makeSun() {
    const grp = new THREE.Group();
    const m = new THREE.ShaderMaterial({
      defines: define, uniforms: { uTime: { value: 0 } },
      vertexShader: planetVert,
      fragmentShader: `uniform float uTime;varying vec3 vObj;varying vec3 vN;varying vec3 vW;${NOISE}
        void main(){vec3 p=normalize(vObj);float n=fbm(p*3.0+vec3(uTime*.05));float m=fbm(p*9.0-vec3(uTime*.08));
        vec3 c=mix(vec3(1.,.55,.18),vec3(1.,.92,.7),smoothstep(-.3,.6,n));c+=vec3(1.,.8,.5)*smoothstep(.3,.8,m)*.4;
        vec3 V=normalize(cameraPosition-vW);float rim=pow(1.0-max(dot(normalize(vN),V),0.),2.0);gl_FragColor=vec4(c*(1.1+rim*.6),1.0);}`,
    });
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(30, 64, 48), m));
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('#ffb35c'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    glow.scale.set(260, 260, 1);
    grp.add(glow);
    scene.add(grp);
    return { group: grp, mat: m, glow };
  }

  const stages = [...document.querySelectorAll('.stage[data-planet]')];
  stages.forEach(s => {
    const k = s.dataset.planet;
    if (PLANETS[k]) bodies.push(Object.assign(makePlanet(k, PLANETS[k]), { el: s }));
  });
  const galaxy = makeGalaxy();
  const sun = makeSun();

  // ---- map document scroll to path parameter
  const CAM_END = 0.93;
  let layout = [];
  function computeLayout() {
    const vh = window.innerHeight;
    const max = Math.max(1, document.documentElement.scrollHeight - vh);
    const small = isSmall();
    layout = stages.map(s => {
      const top = s.offsetTop, h = s.offsetHeight;
      return { el: s, key: s.dataset.planet, side: s.dataset.side, center: clamp((top + h / 2 - vh / 2) / max, 0, 1), start: clamp((top - vh * 0.4) / max, 0, 1) };
    });
    const aspect = window.innerWidth / vh;
    layout.forEach(L => {
      const b = bodies.find(x => x.el === L.el);
      if (!b) return;
      const ahead = L.key === 'hero' ? 135 : 92;
      const halfW = Math.tan(THREE.MathUtils.degToRad(27.5)) * ahead * aspect;
      const f = frameAt(L.center * CAM_END + ahead / pathLen);
      let side = L.side === 'right' ? 1 : L.side === 'left' ? -1 : 0;
      let off = small ? 0 : side * Math.min(halfW * 0.6, L.key === 'hero' ? 95 : 70);
      const pos = f.p.clone().addScaledVector(f.r, off);
      if (small) pos.addScaledVector(f.up, b.r * 0.9).addScaledVector(f.t, 30);
      if (L.key === 'hero') {
        pos.addScaledVector(f.up, small ? 10 : -4);
      }
      b.group.position.copy(pos);
    });
    const ac = layout.find(l => l.key === 'galaxy');
    if (ac) {
      const f = frameAt(lerp(ac.start, ac.center, 0.9) * CAM_END + 140 / pathLen);
      galaxy.group.position.copy(f.p).addScaledVector(f.up, -95);
    }
    const fe = frameAt(1);
    sun.group.position.copy(fe.p).addScaledVector(fe.t, 260).addScaledVector(fe.up, small ? 150 : 108);
  }

  // ---- input
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', e => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let target = 0, current = 0, velocity = 0;
  const readScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    target = clamp(window.scrollY / max, 0, 1);
  };
  window.addEventListener('scroll', readScroll, { passive: true });

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    computeLayout();
    readScroll();
  }
  window.addEventListener('resize', resize);
  new ResizeObserver(() => { computeLayout(); readScroll(); }).observe(document.getElementById('main'));

  computeLayout(); readScroll(); current = target;

  const clock = new THREE.Clock();
  const look = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  let running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) { clock.getDelta(); loop(); } });

  function loop() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;
    const prev = current;
    current = reduceMotion ? target : lerp(current, target, 1 - Math.exp(-dt * 4.2));
    velocity = lerp(velocity, ((current - prev) / Math.max(dt, 1e-4)) * pathLen, 0.2);

    mouse.x = lerp(mouse.x, mouse.tx, 0.05); mouse.y = lerp(mouse.y, mouse.ty, 0.05);
    const u = current * CAM_END;
    const f = frameAt(u);
    camera.position.copy(f.p).addScaledVector(f.r, mouse.x * 2.2).addScaledVector(f.up, -mouse.y * 1.6);
    const fl = frameAt(Math.min(u + 30 / pathLen, 1));
    look.copy(fl.p);
    camera.up.copy(f.up);
    camera.lookAt(look);
    camera.rotateZ(clamp(-velocity * 0.0009, -0.08, 0.08));

    nebula.position.copy(camera.position);
    const tt = reduceMotion ? 0 : time;
    nebula.material.uniforms.uTime.value = tt;
    nebula.material.uniforms.uShift.value = current;
    starMat.uniforms.uTime.value = tt;
    const speed = Math.abs(velocity);
    streakMat.uniforms.uStretch.value = reduceMotion ? 0 : clamp((speed - 40) * 0.12, 0, 46);
    starMat.uniforms.uBoost.value = clamp(speed / 400, 0, 1);

    bodies.forEach(b => {
      b.uni.uTime.value = tt;
      if (!reduceMotion) b.body.rotation.y += b.spin * dt;
      const d = tmp.subVectors(b.group.position, camera.position).length();
      b.uni.uFade.value = clamp(1.4 - d / 520, 0, 1);
      b.group.visible = d < 900;
    });
    if (!reduceMotion) galaxy.group.rotation.y += dt * 0.025;
    const gd = tmp.subVectors(galaxy.group.position, camera.position).length();
    galaxy.mat.uniforms.uFade.value = clamp(1.6 - gd / 700, 0, 1);
    galaxy.core.material.opacity = galaxy.mat.uniforms.uFade.value * 0.7;
    sun.mat.uniforms.uTime.value = tt;
    const sd = tmp.subVectors(sun.group.position, camera.position).length();
    sun.group.visible = sd < 1400;
    sun.glow.material.opacity = clamp(1.3 - sd / 900, 0.2, 1);

    renderer.render(scene, camera);
    telemetry(current, velocity);
    requestAnimationFrame(loop);
  }
  loop();
  return { computeLayout };
}

/* =========================================================
   4. HUD: stage tracker, telemetry, orbiting satellite
   ========================================================= */
const tEl = { el: document.getElementById('tElapsed'), range: document.getElementById('tRange'), vel: document.getElementById('tVel') };
const t0 = performance.now();
let lastTele = 0;
function telemetry(progress, vel) {
  const now = performance.now();
  if (now - lastTele < 120) return;
  lastTele = now;
  const s = Math.floor((now - t0) / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, '0'), mm = String(Math.floor(s / 60) % 60).padStart(2, '0'), ss = String(s % 60).padStart(2, '0');
  tEl.el.textContent = `${hh}:${mm}:${ss}`;
  tEl.range.textContent = (progress * 9.54).toFixed(2) + ' AU';
  tEl.vel.textContent = (Math.abs(vel) * 0.9).toFixed(1) + ' km/s';
}

function buildTracker() {
  const list = document.getElementById('trackerList');
  const stages = [...document.querySelectorAll('.stage[data-stage]')];
  const links = stages.map(s => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + s.id;
    a.innerHTML = `<span>${s.dataset.stage}</span><i></i>`;
    li.append(a); list.append(li);
    return a;
  });
  const navLinks = [...document.querySelectorAll('.topnav a')];
  const setActive = (idx) => {
    links.forEach((a, i) => { a.classList.toggle('is-active', i === idx); a.classList.toggle('is-past', i < idx); a.toggleAttribute('aria-current', i === idx); });
    const id = stages[idx].id;
    navLinks.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + id ? 'true' : 'false'));
  };
  const onScroll = () => {
    const mid = window.innerHeight * 0.45;
    let idx = 0;
    stages.forEach((s, i) => { if (s.getBoundingClientRect().top <= mid) idx = i; });
    setActive(idx);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function orbitSatellite() {
  const sat = document.querySelector('.satellite');
  const svg = document.querySelector('.orbit');
  const pathEl = document.getElementById('orbitPath');
  if (!sat || !pathEl) return;
  const L = pathEl.getTotalLength();
  const host = sat.parentElement;
  let start = performance.now();
  function place(now) {
    const k = reduceMotion ? 0.18 : ((now - start) / 15000) % 1;
    const p = pathEl.getPointAtLength(k * L);
    const sr = svg.getBoundingClientRect(), hr = host.getBoundingClientRect();
    const x = sr.left - hr.left + (p.x / 1000) * sr.width;
    const y = sr.top - hr.top + (p.y / 220) * sr.height;
    sat.style.transform = `translate(${x}px,${y}px)`;
    // dip behind the lettering on the far side of the orbit
    sat.style.opacity = p.y < 95 ? '0.45' : '1';
    if (!reduceMotion) requestAnimationFrame(place);
  }
  requestAnimationFrame(place);
  if (reduceMotion) window.addEventListener('resize', () => requestAnimationFrame(place));
}

function copyButtons() {
  document.querySelectorAll('.copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copy); }
      catch (e) {
        const ta = document.createElement('textarea'); ta.value = btn.dataset.copy; document.body.append(ta); ta.select();
        try { document.execCommand('copy'); } catch (_) {} ta.remove();
      }
      btn.textContent = 'Copied'; btn.classList.add('is-copied');
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('is-copied'); }, 1600);
    });
  });
}

function spectrumBands() {
  document.querySelectorAll('.band').forEach((b, i) => {
    const n = b.querySelector('dd').textContent.split(',').length;
    b.style.setProperty('--w', Math.min(100, 18 + n * 9) + '%');
  });
}

/* =========================================================
   5. Academy: lesson logs, filters, drawer, star map
   ========================================================= */
function academy() {
  const C = window.COURSE;
  if (!C) return;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const mins = (s) => Math.round(s / 60);
  document.getElementById('statLessons').textContent = C.lessons;
  document.getElementById('statHours').textContent = (C.totalSeconds / 3600).toFixed(1);
  document.getElementById('statChapters').textContent = C.chapters.length;

  // flat index
  const flat = [];
  C.chapters.forEach((ch, ci) => ch.lessons.forEach((l, li) => flat.push({ ci, li, ch, l })));
  const chLabel = (ch) => ch.phase === 'B' ? 'Maths bonus' : ch.phase === 'P1' ? `Phase 1, chapter ${ch.num}` : `Phase 2, chapter ${ch.num}`;
  const chNo = (ch) => ch.phase === 'B' ? 'M' : String(ch.num).padStart(2, '0');
  const kindName = { theory: 'Theory', project: 'Project', bonus: 'Maths' };

  // ---- list
  const logs = document.getElementById('logs');
  const phaseIntro = {
    B: 'The calculus behind optimisation, taught with worked examples.',
    P1: 'Theory chapters build intuition; project chapters write every line live, bugs included.',
    P2: 'Turning a notebook model into a cached, rate-limited, queue-backed service in containers.',
  };
  const chapterEls = [];
  const lessonEls = [];
  let currentPhase = null, wrap = null;
  C.chapters.forEach((ch, ci) => {
    if (ch.phase !== currentPhase) {
      currentPhase = ch.phase;
      const block = document.createElement('div');
      block.innerHTML = `<h3 class="phase-head">${C.phases[ch.phase]}<small>${phaseIntro[ch.phase]}</small></h3>`;
      wrap = document.createElement('div'); wrap.className = 'chapters';
      block.append(wrap); logs.append(block);
    }
    const total = ch.lessons.reduce((a, l) => a + l.d, 0);
    const d = document.createElement('details');
    d.className = 'chapter';
    d.dataset.ci = ci;
    d.innerHTML = `<summary>
        <span class="chapter__no">${chNo(ch)}</span>
        <span class="chapter__title">${ch.title}<span class="chapter__blurb">${ch.blurb}</span></span>
        <span class="chapter__meta"><span class="kind"><i class="dot dot--${ch.kind}"></i>${kindName[ch.kind]}</span><br>${ch.lessons.length} ${ch.lessons.length === 1 ? 'lesson' : 'lessons'}, ${mins(total)} min</span>
      </summary>`;
    const ul = document.createElement('ul'); ul.className = 'lessons';
    ch.lessons.forEach((l, li) => {
      const item = document.createElement('li'); item.className = 'lesson';
      const b = document.createElement('button'); b.type = 'button';
      b.innerHTML = `<span class="lesson__no">${String(li + 1).padStart(2, '0')}</span><span class="lesson__t"></span><span class="lesson__d">${fmt(l.d)}</span>`;
      b.querySelector('.lesson__t').textContent = l.t;
      b.addEventListener('click', () => openLesson(ci, li, b));
      item.append(b); ul.append(item);
      lessonEls.push({ ci, li, el: item });
    });
    d.append(ul); wrap.append(d);
    chapterEls.push(d);
  });

  // ---- filtering
  let filter = 'all', query = '';
  const matchCount = document.getElementById('matchCount');
  const chipBtns = [...document.querySelectorAll('.chip')];
  chipBtns.forEach(b => b.addEventListener('click', () => {
    filter = b.dataset.filter;
    chipBtns.forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
    apply();
  }));
  const search = document.getElementById('lessonSearch');
  search.addEventListener('input', () => { query = search.value.trim().toLowerCase(); apply(); });

  const chapterPasses = (ch) => filter === 'all' || ch.kind === filter || ch.phase === filter;
  const lessonHits = (ch, l) => !query || (l.t + ' ' + l.s + ' ' + l.k.join(' ') + ' ' + ch.title).toLowerCase().includes(query);
  let visibility = flat.map(() => true);

  function apply() {
    let shown = 0, chShown = 0;
    visibility = flat.map(({ ch, l }) => chapterPasses(ch) && lessonHits(ch, l));
    C.chapters.forEach((ch, ci) => {
      const lessonsVisible = lessonEls.filter(x => x.ci === ci).map(x => {
        const vis = visibility[flat.findIndex(f => f.ci === ci && f.li === x.li)];
        x.el.hidden = !vis;
        x.el.classList.toggle('is-hit', !!query && vis);
        return vis;
      });
      const any = lessonsVisible.some(Boolean);
      chapterEls[ci].hidden = !any;
      if (any) chShown++;
      shown += lessonsVisible.filter(Boolean).length;
      if (query) chapterEls[ci].open = any;
    });
    matchCount.textContent = (query || filter !== 'all') ? `${shown} of ${C.lessons} lessons in ${chShown} chapters` : `${C.lessons} lessons`;
    let empty = logs.querySelector('.empty');
    if (!shown) {
      if (!empty) { empty = document.createElement('p'); empty.className = 'empty'; logs.prepend(empty); }
      empty.textContent = `No lesson mentions "${search.value}". Try a broader word, or clear the search.`;
    } else if (empty) empty.remove();
    logs.querySelectorAll('.chapters').forEach(w => { w.parentElement.hidden = ![...w.children].some(c => !c.hidden); });
    map && map.draw();
  }

  // ---- drawer
  const drawer = document.getElementById('drawer');
  const dEls = {
    chapter: document.getElementById('drawerChapter'), title: document.getElementById('drawerTitle'),
    meta: document.getElementById('drawerMeta'), body: document.getElementById('drawerBody'), tags: document.getElementById('drawerTags'),
    prev: document.getElementById('drawerPrev'), next: document.getElementById('drawerNext'),
  };
  let currentIdx = -1, returnFocus = null;
  function openLesson(ci, li, from) {
    currentIdx = flat.findIndex(f => f.ci === ci && f.li === li);
    if (from) returnFocus = from;
    const { ch, l } = flat[currentIdx];
    dEls.chapter.textContent = `${chLabel(ch)}: ${ch.title}`;
    dEls.title.textContent = l.t;
    dEls.meta.textContent = `Lesson ${li + 1} of ${ch.lessons.length}, ${fmt(l.d)} long, ${kindName[ch.kind].toLowerCase()} chapter`;
    dEls.body.textContent = l.s;
    dEls.tags.innerHTML = '';
    l.k.forEach(k => { const t = document.createElement('li'); t.textContent = k; dEls.tags.append(t); });
    dEls.prev.disabled = currentIdx === 0;
    dEls.next.disabled = currentIdx === flat.length - 1;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.focus({ preventScroll: true });
    map && map.select(currentIdx);
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    map && map.select(-1);
    if (returnFocus) returnFocus.focus({ preventScroll: true });
  }
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  dEls.prev.addEventListener('click', () => { const f = flat[currentIdx - 1]; if (f) openLesson(f.ci, f.li); });
  dEls.next.addEventListener('click', () => { const f = flat[currentIdx + 1]; if (f) openLesson(f.ci, f.li); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer(); });

  // ---- star map
  const map = starMap(C, flat, () => visibility, (i, el) => openLesson(flat[i].ci, flat[i].li, el), chNo);
  apply();
}

function starMap(C, flat, getVis, onPick, chNo) {
  const canvas = document.getElementById('starmap');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  const tip = document.getElementById('starTip');
  const colors = { theory: '#7fe7ff', project: '#ffb35c', bonus: '#c9bcff' };
  let W = 0, H = 0, DPR = 1;
  let stars = [], chapters = [], dust = [];
  let hover = -1, selected = -1, visible = false;

  // deterministic random
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  function layoutMap() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seed = 7;
    const cx = W * 0.5, cy = H * 0.52;
    const n = C.chapters.length;
    const sx = W * 0.40, sy = H * 0.43;
    chapters = C.chapters.map((ch, i) => {
      const k = i / (n - 1);
      const rr = i === 0 ? 0 : 0.16 + 0.84 * Math.pow(k, 0.92);
      const th = i * 0.93 + 0.4;
      return { ch, x: cx + Math.cos(th) * rr * sx, y: cy + Math.sin(th) * rr * sy, th };
    });
    stars = [];
    flat.forEach((f, idx) => {
      const c = chapters[f.ci];
      const cnt = f.ch.lessons.length;
      const spread = Math.min(W, H) * (0.018 + Math.sqrt(cnt) * 0.017);
      const a = (f.li / Math.max(cnt, 1)) * Math.PI * 2 + rnd() * 0.9 + c.th;
      const d = cnt === 1 ? 0 : spread * (0.45 + rnd() * 0.55);
      stars.push({ idx, x: c.x + Math.cos(a) * d, y: c.y + Math.sin(a) * d * 0.8, r: 1.6 + (f.l.d / 60) * 0.16, color: colors[f.ch.kind], ci: f.ci, tw: rnd() * 6.28 });
    });
    dust = [];
    for (let i = 0; i < 900; i++) {
      const t = rnd() * 3 * Math.PI * 2 / 3 + 0.4;
      const arm = Math.floor(rnd() * 2) * Math.PI;
      const rr = Math.pow(t / (Math.PI * 2), 1.1) * 0.55;
      const jitter = (rnd() - 0.5) * 0.12;
      dust.push({ x: cx + Math.cos(t + arm) * (rr + jitter) * sx * 1.4, y: cy + Math.sin(t + arm) * (rr + jitter) * sy * 1.4, a: rnd() * 0.35 });
    }
  }

  function draw(time = 0) {
    if (!W) return;
    const vis = getVis();
    ctx.clearRect(0, 0, W, H);
    // spiral dust
    dust.forEach(d => { ctx.fillStyle = `rgba(201,188,255,${d.a * 0.5})`; ctx.fillRect(d.x, d.y, 1, 1); });
    const hoverCh = hover >= 0 ? stars[hover].ci : (selected >= 0 ? stars[selected].ci : -1);
    // constellation lines
    let prev = null;
    stars.forEach(s => {
      if (prev && prev.ci === s.ci) {
        const on = vis[s.idx] && vis[prev.idx];
        const hl = s.ci === hoverCh;
        ctx.strokeStyle = hl ? 'rgba(238,240,255,.75)' : `rgba(163,171,214,${on ? 0.28 : 0.06})`;
        ctx.lineWidth = hl ? 1.2 : 0.8;
        ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(s.x, s.y); ctx.stroke();
      }
      prev = s;
    });
    // stars
    stars.forEach(s => {
      const on = vis[s.idx];
      const tw = reduceMotion ? 1 : 0.8 + 0.2 * Math.sin(time * 0.0016 + s.tw);
      const r = s.r * (s.idx === hover || s.idx === selected ? 1.8 : 1) * tw;
      const alpha = on ? 1 : 0.14;
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 5);
      g.addColorStop(0, hexA(s.color, 0.55 * alpha)); g.addColorStop(1, hexA(s.color, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, s.y, r * 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = on ? '#fff' : 'rgba(255,255,255,.2)';
      ctx.beginPath(); ctx.arc(s.x, s.y, r * 0.75, 0, Math.PI * 2); ctx.fill();
      if (s.idx === selected) { ctx.strokeStyle = s.color; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(s.x, s.y, r * 3.2, 0, Math.PI * 2); ctx.stroke(); }
    });
    // chapter labels
    ctx.font = '500 11px "Hanken Grotesk", sans-serif';
    ctx.textBaseline = 'middle';
    const placed = [];
    chapters.forEach((c, ci) => {
      const any = stars.some(s => s.ci === ci && vis[s.idx]);
      const hl = ci === hoverCh;
      const label = `${chNo(c.ch)}  ${c.ch.title}`;
      let out = Math.cos(c.th) >= 0 ? 1 : -1;
      const spread = Math.min(W, H) * (0.03 + Math.sqrt(c.ch.lessons.length) * 0.019);
      const tw = ctx.measureText(label).width;
      if (out > 0 && c.x + spread + 10 + tw > W - 10) out = -1;
      else if (out < 0 && c.x - spread - 10 - tw < 10) out = 1;
      const lx = c.x + out * (spread + 10);
      let ly = c.y - spread * 0.55;
      const x0 = out > 0 ? lx : lx - tw;
      const hit = (y) => placed.some(r => x0 < r.x + r.w + 6 && x0 + tw + 6 > r.x && Math.abs(y - r.y) < 14);
      let ok = !hit(ly);
      for (const dy of [14, -14, 28, -28]) { if (ok) break; if (!hit(ly + dy)) { ly += dy; ok = true; } }
      ctx.textAlign = out > 0 ? 'left' : 'right';
      ctx.fillStyle = hl ? '#eef0ff' : `rgba(163,171,214,${any ? 0.75 : 0.18})`;
      if ((ok && W > 760) || hl) { ctx.fillText(label, lx, ly); placed.push({ x: x0, y: ly, w: tw }); }
    });
  }

  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  }

  function pick(x, y) {
    let best = -1, bd = 18 * 18;
    stars.forEach(s => { const d = (s.x - x) ** 2 + (s.y - y) ** 2; if (d < bd) { bd = d; best = s.idx; } });
    return best;
  }
  canvas.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    const i = pick(e.clientX - r.left, e.clientY - r.top);
    if (i !== hover) {
      hover = i;
      canvas.style.cursor = i >= 0 ? 'pointer' : 'crosshair';
      if (i >= 0) {
        const f = flat[i], s = stars[i];
        tip.innerHTML = `<small></small><span></span>`;
        tip.querySelector('small').textContent = f.ch.title;
        tip.querySelector('span').textContent = f.l.t;
        tip.style.left = s.x + 'px'; tip.style.top = s.y + 'px';
        tip.hidden = false;
      } else tip.hidden = true;
      if (reduceMotion) draw();
    }
  });
  canvas.addEventListener('pointerleave', () => { hover = -1; tip.hidden = true; if (reduceMotion) draw(); });
  canvas.addEventListener('click', e => {
    const r = canvas.getBoundingClientRect();
    const i = pick(e.clientX - r.left, e.clientY - r.top);
    if (i >= 0) onPick(i, null);
  });

  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !reduceMotion) requestAnimationFrame(tick); }).observe(canvas);
  let last = 0;
  function tick(t) {
    if (!visible) return;
    if (t - last > 33) { draw(t); last = t; }
    requestAnimationFrame(tick);
  }
  const relayout = () => { layoutMap(); draw(); };
  window.addEventListener('resize', relayout);
  document.fonts && document.fonts.ready.then(relayout);
  layoutMap();
  return { draw: () => draw(performance.now()), select: (i) => { selected = i; draw(performance.now()); } };
}

/* =========================================================
   Boot everything
   ========================================================= */
academy();
buildTracker();
orbitSatellite();
copyButtons();
spectrumBands();
const space = createSpace();
document.fonts && document.fonts.ready.then(() => space && space.computeLayout());
runBoot();
