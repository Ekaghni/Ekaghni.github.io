window.COURSE = {
"phases": {
"B": "Bonus: Mathematics Foundations",
"P1": "Phase 1: AI/ML Curriculum & Projects",
"P2": "Phase 2: AI System Architecture & Deployment"
},
"chapters": [
{
"id": "B-0",
"phase": "B",
"num": 0,
"title": "Mathematics for ML",
"kind": "bonus",
"blurb": "The calculus underneath every optimiser: regression, derivatives, curvature and why second-order methods converge faster.",
"core": true,
"lessons": [
{
"t": "Linear and Logistic Regression",
"d": 631,
"s": "Starts with the one question that decides the algorithm: are you predicting a number or a category? A Bangalore house-price example shows how linear regression finds the best line (every square foot adds ₹5,000 on top of a ₹5 lakh base), then the lesson moves into live scikit-learn code: reshaping features to 2D, fitting the model, and reading R², the intercept and the slope.",
"k": [
"scikit-learn",
"R²",
"reshape",
"intercept/slope"
]
},
{
"t": "Third and Higher Order Derivatives",
"d": 928,
"s": "Analyses h(x) = x⁴ − 4x³ at four levels. The first derivative finds the flat spots, the second derivative tests them, the third resolves a horizontal inflection the second test can't, and the fourth confirms the function is well behaved. Each level is then tied back to training: SGD versus Adam, picking a learning rate (three cars on a roller coaster), and diagnosing loss that stalls or explodes.",
"k": [
"critical points",
"inflection",
"curvature",
"Newton",
"Adam"
]
},
{
"t": "Higher Order Derivatives Final",
"d": 1109,
"s": "Gradient descent is framed as a blindfolded hike, then worked by hand on x² − 6x + 10: 0 → 1.8 → 2.52 → 2.81 → 2.92, creeping towards 3. Newton's method lands on 3 in a single step because it also knows the curvature. Along the way: second derivatives of x³ and 2x⁴ − 12x² + 5, inflection points, curvature regions, and why first-order methods struggle with ill-conditioned problems.",
"k": [
"gradient descent",
"Newton's method",
"curvature"
]
}
]
},
{
"id": "P1-1",
"phase": "P1",
"num": 1,
"title": "Foundations: AI, ML & Python",
"kind": "theory",
"blurb": "What AI, ML and deep learning are, the Python data stack, and how text becomes something a model can use.",
"core": true,
"lessons": [
{
"t": "Introduction to AI, Machine Learning and Deep Learning",
"d": 852,
"s": "Untangles the buzzwords with a nesting-doll picture: AI contains machine learning, which contains deep learning. Covers rules versus learning from examples, supervised versus unsupervised learning, and classification versus regression. It closes with real applications in healthcare, finance, retail, self-driving and entertainment, and why Python became the language of the field.",
"k": [
"taxonomy",
"supervised/unsupervised",
"classification/regression"
]
},
{
"t": "Essential Python Libraries for Machine Learning",
"d": 962,
"s": "The working toolkit for every later lesson. NumPy: vectorised maths, array creation, slicing and boolean masks, reshape and flatten. Pandas: DataFrames, loading CSV, Excel and JSON, exploring with head, info and describe, filtering, handling missing values, groupby and apply.",
"k": [
"NumPy",
"Pandas"
]
},
{
"t": "Data Visualization and Python Environment Setup",
"d": 594,
"s": "Finishes Pandas with sorting and SQL-style merges, then turns numbers into pictures with Matplotlib: line, scatter, bar, histogram and box plots, with titles, labels, styles, legends and subplots. Ends with professional setup: pip, virtual environments on Windows and macOS, and reproducible installs through requirements.txt.",
"k": [
"Matplotlib",
"venv",
"pip"
]
},
{
"t": "Introduction to NLP",
"d": 637,
"s": "Why text is the messiest data there is, from ambiguous sentences like \"I saw the man with the telescope\" to sarcasm. Separates understanding (NLU) from generation (NLG), then walks the preprocessing pipeline: tokenisation, lowercasing and its exceptions, stop words, punctuation, stemming versus lemmatisation. Surveys where NLP runs today and the libraries that matter: NLTK, spaCy, Transformers and VADER.",
"k": [
"NLU/NLG",
"preprocessing"
]
}
]
},
{
"id": "P1-2",
"phase": "P1",
"num": 2,
"title": "Sentiment Analysis with VADER",
"kind": "project",
"blurb": "First end-to-end NLP build: a lexicon-based sentiment engine with a SQLite history.",
"core": true,
"lessons": [
{
"t": "Sentiment Analysis Project Overview",
"d": 643,
"s": "Sets up the first real project. Explains why businesses care about sentiment, why sarcasm and negation make it hard, and how VADER scores text: a lexicon of rated words adjusted by intensifiers, capitals, exclamation marks and \"but\" clauses. Covers the four scores, the ±0.05 compound threshold, and single versus batch analysis.",
"k": [
"VADER",
"lexicon",
"compound score"
]
},
{
"t": "VADER Setup and Database Integration",
"d": 757,
"s": "Live coding begins. A SentimentAnalyzer class wraps VADER and opens a SQLite database with a seven-column records table (text, label, three scores, compound, timestamp). The analyze method guards against empty input and turns the compound score into positive, negative or neutral.",
"k": [
"SQLite",
"class design"
]
},
{
"t": "Analysis Functions and Batch Processing",
"d": 775,
"s": "Completes the system: a structured result, parameterised inserts with timestamps, and a history query ordered newest first with a limit. Tested live on \"This is amazing!\" (+0.62), \"This product is worst\" (−0.66) and a mixed sentence, including fixing a SQL comma bug on camera.",
"k": [
"SQL queries",
"testing"
]
}
]
},
{
"id": "P1-3",
"phase": "P1",
"num": 3,
"title": "Neural Networks & Computer Vision",
"kind": "theory",
"blurb": "Neurons, backpropagation, images as tensors, OpenCV and the convolutional networks that read them.",
"core": true,
"lessons": [
{
"t": "Introduction to Neural Networks and Deep Learning",
"d": 670,
"s": "From a biological neuron to an artificial one: weights, bias and activation, explained through deciding whether to go to a party. Covers ReLU, sigmoid and tanh and why non-linearity matters, then traces forward propagation through an MNIST digit, measures error with a loss, and shows how backpropagation and gradient descent update the weights.",
"k": [
"neurons",
"forward/backprop",
"activation"
]
},
{
"t": "Computer Vision Fundamentals and Image Processing",
"d": 828,
"s": "How a computer sees: pixels, RGB values, the OpenCV BGR quirk, and grayscale versus colour tensors. Hands-on OpenCV for reading, colour-space conversion, resizing, rotating, cropping, flipping and drawing. Then the core vision tasks (classification, detection, semantic and instance segmentation) and how convolution, filters and max pooling let CNNs learn features.",
"k": [
"OpenCV",
"CNN",
"segmentation"
]
}
]
},
{
"id": "P1-4",
"phase": "P1",
"num": 4,
"title": "Face Recognition System",
"kind": "project",
"blurb": "Register a face from three webcam captures, then recognise it live with 128-d encodings and distance matching.",
"core": true,
"lessons": [
{
"t": "Face Recognition System Overview",
"d": 325,
"s": "Introduces the face-recognition build. Separates detection (where is a face) from recognition (whose face), explains 128-number face encodings and the 0.6 distance threshold, and covers what real-time recognition needs: 30 fps processing, background threads, and SQLite logs with confidence scores for attendance and security uses.",
"k": [
"face encodings",
"threshold"
]
},
{
"t": "Import Libraries and Recognition Class Setup",
"d": 544,
"s": "Sets up the project: OpenCV, NumPy, face_recognition, pickle and os. Builds the FaceRecognition class with lists of known encodings and names, plus load and save methods so registered faces persist between runs.",
"k": [
"pickle persistence",
"class"
]
},
{
"t": "User Registration and Encoding Averaging",
"d": 726,
"s": "Builds registration. Opens the webcam, mirrors the frame, converts BGR to RGB, finds face locations and draws a green box around each face (with the BGR colour tuple explained). An on-screen counter guides the user through three captures from different angles.",
"k": [
"webcam capture",
"bounding boxes"
]
},
{
"t": "Recognition Engine and Distance Matching",
"d": 882,
"s": "Captures on a key press, turns each face into a 128-dimensional encoding, and averages the three encodings with np.mean so the stored face is robust to angle and lighting. Then starts the recognition loop that pairs every detected location with its encoding.",
"k": [
"averaging encodings",
"matching"
]
},
{
"t": "Real-Time Webcam Integration",
"d": 867,
"s": "Matches faces with compare_faces at a stricter 0.5 tolerance, ranks candidates by Euclidean distance, and converts the best distance into a confidence percentage. Draws a filled name banner for readability and wires up the program flow: register a name, then recognise.",
"k": [
"Euclidean distance",
"confidence"
]
},
{
"t": "Final Model Testing",
"d": 357,
"s": "Live testing with real bugs fixed on camera. A face is registered live from the webcam, then a well-known cricketer from photos on a phone. The system tells the two apart at about 70% confidence and still recognises an unseen photo. Closes with extension ideas such as an attendance system.",
"k": [
"live demo",
"debugging"
]
}
]
},
{
"id": "P1-5",
"phase": "P1",
"num": 5,
"title": "Transformers & LLMs",
"kind": "theory",
"blurb": "Self-attention from first principles, then how large language models are pre-trained, tuned, tokenised and sampled.",
"core": true,
"lessons": [
{
"t": "Understanding Transformer Architecture and Self-Attention",
"d": 829,
"s": "The 2017 paper that changed AI. Why RNNs and LSTMs hit a wall (sequential processing, fading long-range memory, idle GPUs) and how self-attention fixes all three. Query, key and value through a networking-event analogy and the \"bank of the river\" example, then multi-head attention, the encoder and decoder stacks, BERT versus GPT versus T5, and positional encodings.",
"k": [
"self-attention",
"QKV",
"multi-head",
"positional encoding"
]
},
{
"t": "Large Language Models Architecture and Training Process",
"d": 820,
"s": "What makes a language model large: data and parameters. Tours the GPT, BERT, LLaMA and Qwen families, then the training story: next-token pre-training, fine-tuning, instruction tuning and RLHF. Explains sub-word tokenisation, embeddings as geometry, context windows and their quadratic cost, and the generation controls temperature, top-p, top-k, max tokens and stop sequences.",
"k": [
"tokenisation",
"embeddings",
"context window",
"sampling"
]
}
]
},
{
"id": "P1-6",
"phase": "P1",
"num": 6,
"title": "AI Document Summariser",
"kind": "project",
"blurb": "A desktop app that reads PDFs and writes abstractive summaries with a local Qwen 2.5 3B model.",
"core": true,
"lessons": [
{
"t": "AI Document Summarizer Overview",
"d": 600,
"s": "Frames the summariser project. Extractive versus abstractive summarisation, a recap of how LLMs process text, and why a local Qwen 2.5 3B model means no API costs. Covers why PDF extraction is harder than it looks, where summarisation is used today, and the five parts of the app: Tkinter GUI, PyPDF2, Qwen, threading and error handling.",
"k": [
"abstractive summarisation",
"local LLM"
]
},
{
"t": "Import Libraries and Setup GUI",
"d": 797,
"s": "Imports Tkinter, PyPDF2, threading, Hugging Face Transformers and PyTorch. Builds the DocumentSummarizer class, loads Qwen2.5-3B-Instruct in float16 on a GPU or float32 on CPU with automatic device placement, and adds the title and Upload PDF button.",
"k": [
"HF transformers",
"fp16",
"device_map"
]
},
{
"t": "Build Main Window Interface",
"d": 597,
"s": "Lays out the main window: a Clear button, a scrolling original-text box, a read-only dropdown for short, medium or long summaries, and the Summarise button, all positioned with pack and padding.",
"k": [
"Tkinter layout"
]
},
{
"t": "Add Summary Length Controls",
"d": 670,
"s": "Adds the summary box and a colour-coded status line. Writes the PDF loader: file dialog, page-by-page text extraction, a character count on success and a red error state on failure.",
"k": [
"PDF extraction",
"UX status"
]
},
{
"t": "PDF Loading and Model Threading",
"d": 976,
"s": "The heart of the app. A length guard, then generation on a background thread so the window never freezes. Builds length-specific instructions and a system-plus-user chat prompt, applies Qwen's chat template, truncates input, and generates with max_new_tokens 350, temperature 0.7 and top-p 0.9.",
"k": [
"chat templates",
"sampling",
"threading"
]
},
{
"t": "Generate AI Summaries",
"d": 690,
"s": "Decodes the output without special tokens, strips the prompt, computes how much shorter the summary is, and hands the result back to the main thread safely with window.after. Adds the clear and run methods and starts testing.",
"k": [
"thread-safe UI updates"
]
},
{
"t": "Finalize and Test Application",
"d": 220,
"s": "Fixes a from_pretrained typo, loads the model shards, and summarises a paragraph generated with Claude. Watches the GPU at work in Task Manager (about 25% utilisation and 6.5 of 8 GB VRAM).",
"k": [
"testing",
"GPU monitoring"
]
}
]
},
{
"id": "P1-7",
"phase": "P1",
"num": 7,
"title": "Real-Time Vision: MediaPipe & SAM",
"kind": "theory",
"blurb": "21-point hand tracking, gesture logic, and Meta's promptable Segment Anything model.",
"core": true,
"lessons": [
{
"t": "MediaPipe Hand Tracking and Gesture Recognition",
"d": 546,
"s": "Google's MediaPipe: real-time hand, pose and face-mesh tracking without a GPU. Covers the two-stage palm-then-landmark pipeline, the 21 hand landmarks and their numbering, and normalised coordinates that work on any camera. Then gesture logic for an open palm, fist, peace sign and thumbs-up, smoothing, swipes and pinches, with uses from VR to sign-language translation.",
"k": [
"landmarks",
"gesture logic"
]
},
{
"t": "Segment Anything Model for Universal Object Segmentation",
"d": 481,
"s": "Meta's Segment Anything Model. Why segmentation needed a model per object before 2023, how training on 1 billion masks enabled zero-shot segmentation, and how point, box and text prompts work. Explains the encode-once architecture that keeps SAM interactive, then shows the API for points, boxes, everything mode and background removal, with uses in Photoshop, medicine and e-commerce.",
"k": [
"foundation model",
"promptable segmentation"
]
}
]
},
{
"id": "P1-8",
"phase": "P1",
"num": 8,
"title": "Capstone: Gesture Game Controller",
"kind": "project",
"blurb": "Drive GTA V with bare hands: finger counting, palm steering, dead zones and keyboard simulation.",
"core": true,
"lessons": [
{
"t": "Hand Gesture Game Controller Overview",
"d": 426,
"s": "The capstone pitch: drive GTA V with bare hands. Counting extended fingers controls acceleration and braking, and palm position steers. Covers the smoothing, dead zones, mirror flip and colour conversion that make it usable, and how normalised coordinates make distance from the camera irrelevant.",
"k": [
"HCI",
"accessibility gaming"
]
},
{
"t": "Import Computer Vision Libraries",
"d": 255,
"s": "Imports OpenCV, MediaPipe, NumPy, time and pynput for simulating key presses, and creates the HandGestureController class.",
"k": [
"pynput"
]
},
{
"t": "Initialize MediaPipe Hand Detection",
"d": 724,
"s": "Configures MediaPipe Hands for video with one hand and tuned detection and tracking confidence. Sets up the keyboard controller, action cooldown, palm history, the screen centre, a steering threshold of 0.08 and a dead zone of 0.03, and maps WASD to forward, back, left and right.",
"k": [
"config",
"thresholds"
]
},
{
"t": "Implement Finger Counting Logic",
"d": 435,
"s": "Maps tip, middle-joint and knuckle landmark IDs for every finger. The thumb needs its own rule: it is checked on the x-axis with logic that works for either hand on either side of the frame.",
"k": [
"landmark geometry"
]
},
{
"t": "Palm Tracking and Steering Mapping",
"d": 311,
"s": "The other four fingers count as extended only when the tip is above the middle joint and the middle joint is above the knuckle, with a small tolerance. Checking both stops a half-bent finger from being miscounted.",
"k": [
"robust finger state"
]
},
{
"t": "Acceleration and Keyboard Command System",
"d": 384,
"s": "Counts extended fingers, finds the palm centre as the midpoint of the wrist and middle knuckle, and keeps a capped history of recent positions for smoothing.",
"k": [
"smoothing"
]
},
{
"t": "Webcam Processing and Color Conversion",
"d": 1212,
"s": "Smooths the palm with a three-frame moving average, then classifies its position with a dead zone, a buffer zone and an active steering zone, the same idea used in game controllers. Sends key actions with clean state management, releasing every held key before pressing new ones so inputs never conflict.",
"k": [
"dead zones",
"state machines"
]
},
{
"t": "Draw Landmarks and Visual Feedback",
"d": 1604,
"s": "The decision tree: four or more fingers accelerate (steering by palm position), one or none brakes, two or three is a neutral buffer. The main loop caps resolution for speed, mirrors and converts frames, draws landmarks, and overlays the current action, releasing all keys when the hand leaves the frame.",
"k": [
"control loop"
]
},
{
"t": "Main Loop and System Testing",
"d": 346,
"s": "Finishes the loop with a quit key and cleanup that always runs. Tested live in Notepad: an open hand types W, a fist types S, palm right types W and D together, palm left types W and A.",
"k": [
"live demo"
]
}
]
},
{
"id": "P1-9",
"phase": "P1",
"num": 9,
"title": "Object Detection & YOLO",
"kind": "theory",
"blurb": "Single-pass detection, non-max suppression, LAB colour space and compositing for real-time effects.",
"core": false,
"lessons": [
{
"t": "Advanced Computer Vision and YOLO Object Detection Overview",
"d": 733,
"s": "Sets up the invisibility cloak by explaining object detection. Moves from hand-written rules to deep learning, then explains how YOLO detects in one pass: grid cells, boxes with confidence, 80 class probabilities and non-max suppression. Covers images as arrays, the LAB colour space, masks and feathering, and the three problems behind convincing invisibility.",
"k": [
"YOLO",
"NMS",
"LAB",
"compositing"
]
}
]
},
{
"id": "P1-10",
"phase": "P1",
"num": 10,
"title": "The Invisibility Cloak",
"kind": "project",
"blurb": "YOLOv8 person detection plus brightness-matched, feathered background compositing inside a magic zone.",
"core": false,
"lessons": [
{
"t": "Setup and YOLO Model Loading",
"d": 781,
"s": "Explains the effect with slides first: a background, a subject and an invisibility zone. Then loads the YOLOv8 nano model, defines the zone as a polygon (with the image coordinate system explained), opens the webcam and runs a 3-2-1 countdown before capturing the background.",
"k": [
"coordinate system"
]
},
{
"t": "Background Capture and LAB Color Processing",
"d": 726,
"s": "Captures the clean background, then writes brightness matching: convert to LAB, compare average colour inside and outside the mask, shift each channel by the difference, clip and convert back. Starts the main loop running YOLO on person detections only.",
"k": [
"colour matching"
]
},
{
"t": "YOLO Detection and Mask Generation",
"d": 920,
"s": "Draws the labelled zone, finds each detected person's box centre, and tests whether it is inside the zone with pointPolygonTest. Pads the box asymmetrically (more on top for hair) and clamps it to the frame.",
"k": [
"geometry tests",
"padding"
]
},
{
"t": "Final Compositing and Live Demo",
"d": 838,
"s": "Builds a mask, matches the background's brightness, feathers the edge with a Gaussian blur, and alpha-blends the background over the person. Labels people visible or invisible, then a live demo of walking in and out of the zone.",
"k": [
"alpha blending",
"live demo"
]
}
]
},
{
"id": "P1-11",
"phase": "P1",
"num": 11,
"title": "Neural Style Transfer",
"kind": "theory",
"blurb": "How VGG-19 separates content from style, and why Gram matrices capture a painter's hand.",
"core": false,
"lessons": [
{
"t": "Neural Style Transfer Theory and Artistic AI Overview",
"d": 914,
"s": "How a network learned to separate what a painting shows from how it is painted. Walks through VGG-19's feature hierarchy, content loss at conv4_2, and style as correlations between features captured by Gram matrices across five layers. Explains why the total loss weights style by a million and how Adam reshapes pixels over about 500 iterations.",
"k": [
"Gram matrix",
"perceptual loss"
]
}
]
},
{
"id": "P1-12",
"phase": "P1",
"num": 12,
"title": "AI Art Style Transfer",
"kind": "project",
"blurb": "Optimise a photo's pixels with Adam until it is painted in Van Gogh's style.",
"core": false,
"lessons": [
{
"t": "Setup and VGG-19 Network",
"d": 665,
"s": "Sets up PyTorch and torchvision, picks CUDA or CPU, and writes an image loader that caps size at 400 pixels to save VRAM and adds the batch dimension. Loads VGG-19's feature layers in eval mode and maps the six layers the algorithm reads.",
"k": [
"feature extraction"
]
},
{
"t": "Gram Matrices and Style Loss Function",
"d": 679,
"s": "Extracts features layer by layer, builds the Gram matrix by flattening and multiplying by its transpose, loads a portrait and a Van Gogh painting, and clones the portrait as the image to optimise. Precomputes the style Gram matrices and sets up Adam.",
"k": [
"optimisation setup"
]
},
{
"t": "Optimization Loop and Final Transfer",
"d": 720,
"s": "Each iteration measures content and style loss, combines them, backpropagates into the pixels and steps the optimiser. Converts the result back to an image, fixes a few bugs live, and the loss falls until Van Gogh's swirls appear on the portrait.",
"k": [
"backprop to pixels",
"live result"
]
}
]
},
{
"id": "P1-13",
"phase": "P1",
"num": 13,
"title": "Diffusion Models",
"kind": "theory",
"blurb": "Every Stable Diffusion control that matters: samplers, CFG, denoising, inpainting, ControlNet and upscaling.",
"core": false,
"lessons": [
{
"t": "Diffusion Models Theory and Architecture Overview",
"d": 886,
"s": "A practical tour of Stable Diffusion's controls. Checkpoints, samplers, steps, native resolution and multiples of 64, CFG scale and its sweet spot, and seeds for repeatable client edits. Then image-to-image resize modes and denoising strength, inpainting masks and fill modes, ControlNet (Canny, OpenPose, Depth, IP-Adapter), face swap with a clear note on consent, and AI upscaling.",
"k": [
"CFG",
"denoising",
"inpainting",
"ControlNet"
]
}
]
},
{
"id": "P1-14",
"phase": "P1",
"num": 14,
"title": "Stable Diffusion Image-to-Image",
"kind": "project",
"blurb": "Automatic1111 with ControlNet and face swap, then automated through its REST API in Python.",
"core": false,
"lessons": [
{
"t": "Setup Automatic1111 and Basic Image Generation",
"d": 1397,
"s": "Installs Automatic1111 step by step: Python, Git, the repository and the launcher. Adds the ControlNet extension and models, the Roop face-swap extension, and checkpoints from CivitAI. Two live demos: turning a portrait into an anime avatar with a Canny-guided anime model, and changing a photo into professional attire while keeping the original pose and face.",
"k": [
"tooling",
"multi-ControlNet"
]
},
{
"t": "ControlNet and Advanced Image Control",
"d": 1833,
"s": "Automates the same workflow in Python through Automatic1111's REST API. Encodes images to base64, builds the full text-to-image payload, configures face swap and OpenPose ControlNet inside it with every argument explained, then posts it, decodes the response and saves the result.",
"k": [
"REST API automation",
"payload design"
]
}
]
},
{
"id": "P1-15",
"phase": "P1",
"num": 15,
"title": "Text Fingerprinting with TF-IDF",
"kind": "theory",
"blurb": "Character n-grams, TF-IDF and cosine similarity as a fingerprint for how someone writes.",
"core": false,
"lessons": [
{
"t": "Text Analysis, TF-IDF and Linguistic Fingerprinting Overview",
"d": 822,
"s": "Every writer has a fingerprint: vocabulary, sentence length, punctuation and favourite phrases. Explains why character n-grams separate how someone writes from what they write about, how TF-IDF weights those patterns, and how cosine similarity compares two texts. Covers uses in plagiarism checks, forensics and publishing, and plans the app.",
"k": [
"char n-grams",
"TF-IDF",
"cosine similarity"
]
}
]
},
{
"id": "P1-16",
"phase": "P1",
"num": 16,
"title": "AI Writing Style Detector",
"kind": "project",
"blurb": "A desktop tool that scores whether two texts share an author.",
"core": false,
"lessons": [
{
"t": "Setup and TF-IDF Vectorization",
"d": 1356,
"s": "Builds the core: a similarity function that rejects empty or very short texts, vectorises both with character-level TF-IDF over 2 to 4 character n-grams, and returns their cosine similarity. Adds the score interpretation and starts the Tkinter interface with two side-by-side text boxes.",
"k": [
"char-level TF-IDF"
]
},
{
"t": "Cosine Similarity and N-gram Analysis",
"d": 554,
"s": "Adds the Clear All button and results panel, then writes the compare action: read both boxes, show an error if either is empty, score them and display the interpretation.",
"k": [
"GUI wiring"
]
},
{
"t": "Desktop GUI and Final Application Testing",
"d": 559,
"s": "Adds word counts and the clear action, then tests with calibrated text pairs: near-identical texts score 0.94, repeated phrasing 0.87, partial overlap 0.60, and unrelated texts 0.08.",
"k": [
"testing with calibrated pairs"
]
}
]
},
{
"id": "P1-17",
"phase": "P1",
"num": 17,
"title": "Medical AI & Transfer Learning",
"kind": "theory",
"blurb": "Clinical data realities, ResNet-50 transfer learning, safe augmentation and sensitivity-first evaluation.",
"core": false,
"lessons": [
{
"t": "Medical AI, Transfer Learning and Healthcare Applications Overview",
"d": 1011,
"s": "A complete medical-AI briefing. The dataset (2,298 images across six diagnoses, grouped into cancerous or not), ResNet-50 transfer learning, streaming data with tf.data, and augmentation that stays medically safe. The model head, class weights and training callbacks, then evaluation the clinical way: confusion matrix, sensitivity and specificity, compared with residents and dermatologists, plus responsible risk communication.",
"k": [
"transfer learning",
"clinical metrics"
]
}
]
},
{
"id": "P1-18",
"phase": "P1",
"num": 18,
"title": "Skin Cancer Detection AI",
"kind": "project",
"blurb": "Eleven lessons from Kaggle download to confusion matrix, with an honest look at the results.",
"core": false,
"lessons": [
{
"t": "Dataset Loading and Initial Setup",
"d": 476,
"s": "Downloads the Kaggle skin-lesion dataset and reads its metadata to decide which lesions count as cancerous. Imports TensorFlow, Pandas, NumPy, PIL, scikit-learn's splitting and metrics tools, tqdm and Matplotlib, and checks for a GPU.",
"k": [
"data sourcing"
]
},
{
"t": "Data Preprocessing and Augmentation",
"d": 666,
"s": "Creates the SkinCancerClassifier class and writes data loading: read the metadata, label each image cancerous or not, and validate every file with a progress bar, skipping anything corrupt.",
"k": [
"data validation"
]
},
{
"t": "ResNet-50 Model Architecture Setup",
"d": 731,
"s": "Splits the data with stratification into training, validation and test sets (64/16/20) and explains why each exists. Prints the class balance with a worked example of counting 0/1 labels.",
"k": [
"stratified splits"
]
},
{
"t": "Transfer Learning and Fine-Tuning",
"d": 722,
"s": "Builds the input pipeline: read the file, decode to three channels, resize to 224 by 224 and normalise to 0-1 (with the reason explained). Adds augmentation that keeps medical meaning: flips plus small changes to brightness, contrast and saturation.",
"k": [
"tf.data preprocessing"
]
},
{
"t": "Class Imbalance Handling",
"d": 462,
"s": "Assembles tf.data pipelines with parallel mapping, batching and prefetching so the GPU never waits. Augmentation is applied to training data only, keeping validation and test data clean for honest measurement.",
"k": [
"input pipelines"
]
},
{
"t": "Model Compilation and Training",
"d": 627,
"s": "Loads ResNet-50 with ImageNet weights and no top, explains skip connections and why it matters, then freezes all but the last 20 layers. Starts the custom head with global average pooling, batch normalisation and dropout, explaining each choice.",
"k": [
"fine-tuning",
"regularisation"
]
},
{
"t": "Early Stopping and Model Checkpointing",
"d": 701,
"s": "Finishes the head with two dense layers and a sigmoid output. Computes balanced class weights with a worked example of why accuracy misleads on imbalanced data. Compiles with a small Adam learning rate to protect the pretrained weights and tracks precision and recall.",
"k": [
"class weights",
"compile"
]
},
{
"t": "Model Evaluation and Confusion Matrix",
"d": 769,
"s": "Writes the training method with three callbacks: early stopping that restores the best weights, a learning-rate cut when progress stalls, and checkpointing that saves the best model in case training crashes.",
"k": [
"callbacks"
]
},
{
"t": "Performance Metrics and Medical Validation",
"d": 939,
"s": "Evaluates on the untouched test set: thresholds, accuracy and a full classification report. Draws the confusion matrix and explains each cell, then derives sensitivity and specificity and the targets a screening tool should meet.",
"k": [
"clinical evaluation"
]
},
{
"t": "Visualizing Predictions",
"d": 1314,
"s": "Adds saving and loading of the trained model and a predict_image method that repeats the training preprocessing exactly. Reports cancer and non-cancer probabilities with a risk level and a clear educational-use disclaimer.",
"k": [
"inference parity",
"responsible AI"
]
},
{
"t": "Final Testing and Deployment Preparation",
"d": 1282,
"s": "Wraps the pipeline in one function and runs it end to end, fixing bugs live. Training stops early at epoch 18. The lesson reports the result honestly (about 61% accuracy and low sensitivity on this small dataset), explains how more data would improve it, and tests six unseen images, four of them correctly.",
"k": [
"honest evaluation",
"iteration"
]
}
]
},
{
"id": "P1-19",
"phase": "P1",
"num": 19,
"title": "LLMs, Financial APIs & Prompting",
"kind": "theory",
"blurb": "Framing a local-LLM investment analyst over live market fundamentals.",
"core": false,
"lessons": [
{
"t": "LLM Integration, Financial APIs and Prompt Engineering Overview",
"d": 99,
"s": "Frames the investment-analysis project: collect fundamentals for 100 Indian companies, structure them, analyse them with a local pretrained LLM, and rank the top ten. Explains in plain terms what a pretrained language model is.",
"k": [
"project framing"
]
}
]
},
{
"id": "P1-20",
"phase": "P1",
"num": 20,
"title": "AI Stock Investment Analyser",
"kind": "project",
"blurb": "Fundamentals for 100 NSE large caps, chunked map-reduce prompting on Ollama, top-10 shortlist.",
"core": false,
"lessons": [
{
"t": "Configuring Ollama and Extracting Stock Fundamentals",
"d": 2021,
"s": "Installs and verifies Ollama and runs Llama 3.2 3B locally. Pulls live NSE data with jugaad-data and fundamentals with yfinance (price, market cap in crores, P/E, P/B, ROE, margins, debt-to-equity, dividend yield, growth and beta), with a fallback when live data fails, progress reporting and polite rate limiting.",
"k": [
"data engineering",
"Ollama"
]
},
{
"t": "Prompt Analysis and Ollama API Calls",
"d": 2314,
"s": "Cleans the data for the model: drops companies under ₹1,000 crore, rounds values and converts ratios to percentages. Splits 100 stocks into chunks of 20 to respect VRAM and the context window, writes a structured analysis prompt, and calls Ollama's API with a low temperature.",
"k": [
"prompt engineering",
"chunking"
]
},
{
"t": "Final Consolidation and Results Analysis",
"d": 1942,
"s": "Combines the chunk analyses and sends them back for a final ranking. Runs the whole pipeline live: about 98 of 100 companies fetched, cleaned, analysed in five chunks and ranked into a top ten with sector allocation, strategy and risks. Ends with a clear warning that this is not investment advice.",
"k": [
"map-reduce LLM pipeline"
]
}
]
},
{
"id": "P2-1",
"phase": "P2",
"num": 1,
"title": "Production AI Pipeline Architecture",
"kind": "project",
"blurb": "From notebook to service: gateways, caching, rate limiting and asynchronous queues.",
"core": true,
"lessons": [
{
"t": "Production AI Pipeline Architecture",
"d": 781,
"s": "Opens Phase 2: why a model that works in a notebook is not a product. Follows one request through a production system (gateway, application server, model server, logging, databases, response) and introduces seven building blocks, including caching and queues. Compares monolithic, microservice and serverless designs, and explains the retraining loop at the heart of MLOps.",
"k": [
"system design",
"MLOps"
]
},
{
"t": "Production Pipeline Architecture Diagram Walkthrough",
"d": 570,
"s": "Walks through the course's own production architecture diagram for a DistilBERT sentiment service. Load balancing, horizontal versus vertical scaling, cache hits and misses, logging and storage, and how RabbitMQ batches 10,000 simultaneous requests without overwhelming the model.",
"k": [
"architecture diagram"
]
},
{
"t": "Redis Caching Setup",
"d": 519,
"s": "Starts Redis in Docker and writes the cache module. A CacheManager connects with a one-hour TTL, health-checks the connection, and degrades gracefully to no caching if Redis is down.",
"k": [
"Redis",
"Docker",
"graceful degradation"
]
},
{
"t": "Cache Key Generation and Redis Functions",
"d": 639,
"s": "Generates namespaced cache keys from MD5 hashes, then writes get (logging hits and misses) and set (storing results with expiry). Reads the Redis host from an environment variable so the same code runs locally and in Docker Compose.",
"k": [
"cache keys",
"TTL"
]
},
{
"t": "Integrating Redis Cache into Predict Endpoint",
"d": 411,
"s": "Puts the cache in front of the predict endpoint and adds a cached flag to the response. Measured live in Swagger: the first request takes about 1,000 ms and repeats return in 1 to 3 ms, roughly 50 to 70 times faster.",
"k": [
"measured speed-up"
]
},
{
"t": "Rate Limiting Middleware",
"d": 649,
"s": "Protects the API with middleware that allows 60 requests per minute per IP. Tracks timestamps in a sliding window and returns HTTP 429 with a retry hint when the limit is hit. Notes when to move the limiter into Redis.",
"k": [
"sliding window rate limiting"
]
},
{
"t": "Rate Limiting Stress Testing",
"d": 655,
"s": "Registers the middleware and stress-tests it with 65 rapid requests. Debugs two real problems on camera (slow tests from opening a new connection every time, and a 500 error instead of 429) and fixes both until request 61 is correctly rejected.",
"k": [
"debugging",
"load testing"
]
},
{
"t": "RabbitMQ Async Queue Setup",
"d": 614,
"s": "Starts RabbitMQ with its management console in Docker and explains when tasks should be asynchronous. Begins a batch worker with its own model instance, an environment-driven host, a retry loop and a durable queue.",
"k": [
"message queues"
]
},
{
"t": "RabbitMQ Connection and Retry Logic",
"d": 847,
"s": "Finishes the worker: exponential backoff on connection failures, a message handler that predicts every text in a batch and logs throughput, acknowledgements on success and requeueing on failure, and one-message-at-a-time prefetch for fair load across workers.",
"k": [
"reliability patterns"
]
}
]
},
{
"id": "P2-2",
"phase": "P2",
"num": 2,
"title": "Containerisation & Orchestration",
"kind": "theory",
"blurb": "Docker and Kubernetes for ML, from WSL setup to rolling, blue-green and canary releases.",
"core": true,
"lessons": [
{
"t": "Containerisation and Orchestration",
"d": 1634,
"s": "Why \"it works on my machine\" happens and how containers fix it. Covers images, layers and Dockerfiles, keeping models out of images, and Docker Compose. Then Kubernetes in depth: the control plane, worker nodes, a step-by-step deployment with self-healing, pods, services and ingress, resource limits, autoscaling, GPU scheduling, and rolling, blue-green and canary releases.",
"k": [
"Docker",
"Kubernetes",
"deployment strategies"
]
},
{
"t": "WSL Installation and Docker Desktop Setup",
"d": 465,
"s": "Prepares a Windows machine for containers: enables WSL and the Virtual Machine Platform, installs Ubuntu, installs Docker Desktop and verifies everything, then confirms Python and Git.",
"k": [
"environment setup"
]
},
{
"t": "Project Folder Structure and Python Package Setup",
"d": 345,
"s": "Scaffolds the production project with app, models and tests folders and a Python package. Creates and activates a virtual environment and installs every dependency, with each one's purpose explained.",
"k": [
"project scaffolding"
]
}
]
},
{
"id": "P2-3",
"phase": "P2",
"num": 3,
"title": "Model Serving & Inference Optimisation",
"kind": "project",
"blurb": "Serving frameworks, quantisation, distillation, and a validated FastAPI DistilBERT service.",
"core": true,
"lessons": [
{
"t": "Model Serving and Inference Optimisation",
"d": 1222,
"s": "Why inference is a different problem from training: latency, throughput and cost. Compares TorchServe, TensorFlow Serving and NVIDIA Triton, weighs serverless against dedicated servers, and explains the three main optimisations (quantisation, pruning and knowledge distillation) with real numbers, such as DistilBERT keeping 97% of BERT's accuracy at 60% faster.",
"k": [
"quantisation",
"distillation",
"serving"
]
},
{
"t": "DistilBERT Model Wrapper and Singleton Pattern",
"d": 649,
"s": "Wraps a DistilBERT sentiment pipeline in a class that loads once at startup, because reloading a large model on every request would cripple a server. Explains CPU versus GPU placement and tests it from the command line.",
"k": [
"model lifecycle"
]
},
{
"t": "Pydantic Request Schemas and Validation",
"d": 880,
"s": "Defines the API contract with Pydantic: text between 1 and 500 characters, whitespace rejected, and a typed response. Sets up structured logging and the FastAPI app, and loads the model once in a startup hook.",
"k": [
"API contracts"
]
},
{
"t": "FastAPI Health Check and Predict Endpoints",
"d": 618,
"s": "Adds a health endpoint for load balancers and Kubernetes, and the predict endpoint with timing, structured logs ready for ELK, typed responses, and safe error handling.",
"k": [
"health checks",
"observability"
]
},
{
"t": "Running with Uvicorn and API Testing",
"d": 350,
"s": "Runs the service with Uvicorn and tests it in Swagger. The health check passes, the first prediction takes 774 ms and the next only 55 ms once the model is warm, and invalid input (empty or over 500 characters) is rejected with clear validation errors.",
"k": [
"API testing",
"edge cases"
]
}
]
}
],
"totalSeconds": 68317,
"lessons": 87
};
