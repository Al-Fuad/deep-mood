# 🧠 DeepMood

> **End-to-End Deep Learning Sentiment & Emotional Nuance Analysis Platform**  
> Powered by Bidirectional Recurrent Neural Networks (BiLSTM & BiGRU), FastAPI, and React.

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15%2B-FF6F00.svg)](https://www.tensorflow.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0%2B-646CFF.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture & ML Pipeline](#architecture--ml-pipeline)
- [Model Evaluation & Benchmarks](#model-evaluation--benchmarks)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (FastAPI)](#backend-setup-fastapi)
  - [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
- [API Documentation](#api-documentation)
- [Screenshots & UI Experience](#screenshots--ui-experience)
- [License](#license)

---

## 🌟 Overview

**DeepMood** is a full-stack deep learning platform that detects and quantifies human emotional nuance in natural language. Built on the benchmark `dair-ai/emotion` dataset, DeepMood classifies text across six primary emotional spectra:

- 😢 **Sadness** (Loss, grief, melancholy, disappointment)
- 😊 **Joy** (Happiness, celebration, contentment, ecstasy)
- ❤️ **Love** (Affection, warmth, devotion, empathy)
- 😡 **Anger** (Frustration, rage, resentment, indignity)
- 😨 **Fear** (Anxiety, terror, panic, apprehension)
- 😲 **Surprise** (Awe, astonishment, astonishment, wonder)

The system compares five distinct recurrent deep learning architectures, providing real-time probability distributions, token-level insights, batch prediction capabilities, and interactive exploratory views in the web interface.

---

## 🚀 Key Features

- **⚡ High-Performance Inference Engine**: Sub-50ms inference via FastAPI and optimized Keras graph models.
- **🔄 Model Selector**: Seamlessly switch between the top-performing **BiLSTM** (91.90% Accuracy) and **BiGRU** (91.70% Accuracy) architectures.
- **📊 Real-time Emotion Probability Vectors**: Visual breakdown of all six emotional classes for every analyzed sentence.
- **🔤 Vocabulary & Token Breakdown**: Highlights which words in user prompts map directly to the 15,213-word trained vocabulary.
- **📦 Batch Testing & Aggregation**: Analyze multiple sentences simultaneously with aggregated emotional distribution charts.
- **🔬 Built-in Project Deep Dive in Frontend**: Explore the entire machine learning journey, dataset statistics, confusion matrices, and model comparison metrics directly from the UI.
- **📖 OpenAPI / Swagger Integration**: Interactive REST API documentation out of the box at `/docs`.

---

## 🏗️ Architecture & ML Pipeline

```
Raw Input Text
      │
      ▼
Tokenizer (15,213 Vocab Size) ───► Word-to-Index Sequences
      │
      ▼
Sequence Padding & Truncation ───► Fixed-Length Vectors (maxlen = 50, post-padded)
      │
      ▼
Embedding Layer (dim = 100) ───► Dense Semantic Embeddings
      │
      ▼
Bidirectional RNN Layer ───────► Forward + Backward Hidden States (BiLSTM / BiGRU, 64 units)
      │
      ▼
Dropout Layer (rate = 0.5) ────► Regularization against overfitting
      │
      ▼
Dense Layer (64 units, ReLU) ──► Non-linear transformation
      │
      ▼
Dropout Layer (rate = 0.5) ────► Final regularization
      │
      ▼
Softmax Output (6 units) ──────► Multiclass Probability Distribution [P(sadness), ..., P(surprise)]
```

---

## 📊 Model Evaluation & Benchmarks

The models were trained and benchmarked on the test split of the `dair-ai/emotion` dataset (16,000 train samples, 2,000 validation samples, 2,000 test samples):

| Rank | Model Architecture | Test Loss | Test Accuracy | Status | Key Characteristic |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 🥇 | **Bidirectional LSTM (BiLSTM)** | **0.2099** | **91.90%** | **Production** | Captures contextual past & future token signals |
| 🥈 | **Bidirectional GRU (BiGRU)** | **0.2188** | **91.70%** | **Production** | Fast convergence with fewer gating parameters |
| 🥉 | **Simple RNN** | 1.7635 | 26.95% | Baseline | Suffers from vanishing gradients on long text |
| 4 | **Unidirectional GRU** | 1.7754 | 26.55% | Baseline | Lacks backwards contextual awareness |
| 5 | **Unidirectional LSTM** | 1.7853 | 11.35% | Baseline | Unidirectional temporal flow without reverse memory |

---

## 📁 Repository Structure

```
deep-mood/
├── backend/                       # FastAPI REST backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI routes, CORS, lifespan
│   │   ├── model_service.py       # Keras & Tokenizer inference engine
│   │   └── schemas.py             # Pydantic request/response validation
│   └── requirements.txt           # Backend dependencies
├── frontend/                      # React SPA with Vite
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/            # Header, ModelComparator, Predictor, BatchTester, ProjectDetails
│   │   ├── App.jsx                # Main application component & tab routing
│   │   ├── index.css              # Custom design system (vanilla CSS, glassmorphism, responsive)
│   │   └── main.jsx               # React DOM entry point
│   ├── package.json
│   └── vite.config.js
├── ml/                            # Machine learning artifacts & notebooks
│   ├── artifacts/
│   │   ├── BiLSTM_model.keras     # Trained Bidirectional LSTM model
│   │   ├── BiGRU_model.keras      # Trained Bidirectional GRU model
│   │   └── tokenizer.pkl          # Pickled Keras Tokenizer
│   ├── notebooks/
│   │   └── deep-mood-notebook.ipynb # Model exploration, EDA, and training notebook
│   └── requirements.txt
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher

---

### Backend Setup (FastAPI)

1. Navigate to the project root and ensure Python virtual environment is activated:
   ```bash
   # From deep-mood root:
   python3 -m venv venv
   source venv/bin/activate
   pip install -r backend/requirements.txt
   ```

2. Run the FastAPI development server:
   ```bash
   uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

3. Verify backend health:
   - Endpoint: `http://localhost:8000/`
   - Interactive Swagger Docs: `http://localhost:8000/docs`

---

### Frontend Setup (React + Vite)

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

---

## 📡 API Documentation

### Key Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Service health status and registered model list |
| `GET` | `/api/info` | Comprehensive project details, dataset metrics, and model specs |
| `GET` | `/api/models` | Benchmark evaluation metrics across all 5 architectures |
| `GET` | `/api/examples` | Curated sample sentences for instant testing |
| `POST` | `/api/predict` | Single sentence sentiment & emotion classification |
| `POST` | `/api/predict/batch` | Multi-sentence batch sentiment analysis & distribution aggregation |

#### Sample Inference Request

```bash
curl -X POST "http://localhost:8000/api/predict" \
     -H "Content-Type: application/json" \
     -d '{
       "text": "I can not believe how thrilled and grateful I am today!",
       "model_name": "BiLSTM"
     }'
```

#### Sample Response

```json
{
  "text": "I can not believe how thrilled and grateful I am today!",
  "model_name": "BiLSTM",
  "prediction": "joy",
  "confidence": 0.9842,
  "probabilities": [
    { "label": "joy", "score": 0.9842, "percentage": 98.42 },
    { "label": "love", "score": 0.0112, "percentage": 1.12 },
    { "label": "surprise", "score": 0.0028, "percentage": 0.28 },
    { "label": "sadness", "score": 0.0011, "percentage": 0.11 },
    { "label": "fear", "score": 0.0005, "percentage": 0.05 },
    { "label": "anger", "score": 0.0002, "percentage": 0.02 }
  ],
  "tokens": [
    { "token": "I", "token_id": 1, "in_vocab": true },
    { "token": "thrilled", "token_id": 2341, "in_vocab": true }
  ],
  "inference_time_ms": 24.18
}
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
