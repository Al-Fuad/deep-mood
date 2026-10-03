from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, description="Input text to analyze emotion for", example="I am so thrilled and grateful for this incredible opportunity!")
    model_name: Optional[str] = Field("BiLSTM", description="Model architecture to use: 'BiLSTM' or 'BiGRU'")

class BatchPredictRequest(BaseModel):
    texts: List[str] = Field(..., min_length=1, max_length=50, description="List of text samples to analyze")
    model_name: Optional[str] = Field("BiLSTM", description="Model architecture to use: 'BiLSTM' or 'BiGRU'")

class EmotionScore(BaseModel):
    label: str
    score: float
    percentage: float

class TokenInfo(BaseModel):
    token: str
    token_id: Optional[int] = None
    in_vocab: bool

class PredictResponse(BaseModel):
    text: str
    model_name: str
    prediction: str
    confidence: float
    probabilities: List[EmotionScore]
    tokens: List[TokenInfo]
    inference_time_ms: float

class BatchPredictResponse(BaseModel):
    model_name: str
    results: List[PredictResponse]
    total_samples: int
    emotion_distribution: Dict[str, int]
    total_time_ms: float

class ModelMetric(BaseModel):
    id: str
    name: str
    architecture: str
    test_accuracy: float
    test_loss: float
    is_active: bool
    description: str

class ExampleSample(BaseModel):
    text: str
    expected_emotion: str
    description: str

class ProjectInfo(BaseModel):
    project_name: str
    version: str
    description: str
    dataset: Dict[str, Any]
    classes: List[str]
    max_sequence_length: int
    models: List[ModelMetric]
    author_or_source: str
