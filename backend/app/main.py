from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    PredictRequest,
    PredictResponse,
    BatchPredictRequest,
    BatchPredictResponse,
    ProjectInfo,
    ModelMetric,
    ExampleSample,
)
from .model_service import model_service, MODEL_BENCHMARKS, CURATED_EXAMPLES

app = FastAPI(
    title="DeepMood API",
    description="Deep Learning Emotion & Sentiment Analysis API using BiLSTM and BiGRU architectures.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS for React frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": "DeepMood Emotion Analysis API",
        "version": "1.0.0",
        "active_models": list(model_service.models.keys()),
        "endpoints": {
            "info": "/api/info",
            "models": "/api/models",
            "examples": "/api/examples",
            "predict": "/api/predict",
            "predict_batch": "/api/predict/batch",
            "docs": "/docs",
        },
    }

@app.get("/api/info", response_model=ProjectInfo, tags=["Metadata"])
def get_project_info():
    """Retrieve full project metadata, dataset details, and training specifications."""
    return model_service.get_project_info()

@app.get("/api/models", response_model=List[ModelMetric], tags=["Metadata"])
def get_models():
    """Retrieve benchmark comparison across evaluated recurrent neural network models."""
    return MODEL_BENCHMARKS

@app.get("/api/examples", response_model=List[ExampleSample], tags=["Metadata"])
def get_examples():
    """Retrieve curated prompt examples covering all 6 emotion classes."""
    return CURATED_EXAMPLES

@app.post("/api/predict", response_model=PredictResponse, tags=["Inference"])
def predict_emotion(request: PredictRequest):
    """Analyze a single piece of text and return predicted emotion and class probabilities."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    try:
        return model_service.predict_single(request.text, model_name=request.model_name or "BiLSTM")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.post("/api/predict/batch", response_model=BatchPredictResponse, tags=["Inference"])
def predict_emotion_batch(request: BatchPredictRequest):
    """Analyze multiple text samples in batch and return distributions and per-sample results."""
    valid_texts = [t.strip() for t in request.texts if t.strip()]
    if not valid_texts:
        raise HTTPException(status_code=400, detail="Must provide at least one non-empty text string.")
    try:
        return model_service.predict_batch(valid_texts, model_name=request.model_name or "BiLSTM")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch inference error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
