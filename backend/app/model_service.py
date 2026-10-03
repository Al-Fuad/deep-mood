import os
import time
import pickle
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences

from .schemas import (
    EmotionScore,
    TokenInfo,
    PredictResponse,
    BatchPredictResponse,
    ModelMetric,
    ExampleSample,
    ProjectInfo,
)

EMOTION_CLASSES = ["sadness", "joy", "love", "anger", "fear", "surprise"]
MAX_SEQUENCE_LENGTH = 50

# Benchmark metrics collected from deep-mood training notebook on dair-ai/emotion
MODEL_BENCHMARKS = [
    ModelMetric(
        id="BiGRU",
        name="Bidirectional GRU",
        architecture="Embedding(100) -> BiGRU(64) -> Dropout(0.5) -> Dense(64, relu) -> Dropout(0.5) -> Dense(6, softmax)",
        test_accuracy=0.9170,
        test_loss=0.2188,
        is_active=True,
        description="Active production model with bidirectional sequence encoding, low memory footprint, and fast inference.",
    ),
    ModelMetric(
        id="BiLSTM",
        name="Bidirectional LSTM",
        architecture="Embedding(100) -> BiLSTM(64) -> Dropout(0.5) -> Dense(64, relu) -> Dropout(0.5) -> Dense(6, softmax)",
        test_accuracy=0.9190,
        test_loss=0.2099,
        is_active=False,
        description="Evaluated benchmark model with bidirectional long short-term memory.",
    ),
    ModelMetric(
        id="RNN",
        name="Simple RNN",
        architecture="Embedding(100) -> SimpleRNN(64) -> Dense(64, relu) -> Dense(6, softmax)",
        test_accuracy=0.2695,
        test_loss=1.7635,
        is_active=False,
        description="Baseline standard recurrent neural network; suffers from vanishing gradients on long dependencies.",
    ),
    ModelMetric(
        id="GRU",
        name="Unidirectional GRU",
        architecture="Embedding(100) -> GRU(64) -> Dense(64, relu) -> Dense(6, softmax)",
        test_accuracy=0.2655,
        test_loss=1.7754,
        is_active=False,
        description="Unidirectional GRU baseline without bidirectional temporal modeling.",
    ),
    ModelMetric(
        id="LSTM",
        name="Unidirectional LSTM",
        architecture="Embedding(100) -> LSTM(64) -> Dense(64, relu) -> Dense(6, softmax)",
        test_accuracy=0.1135,
        test_loss=1.7853,
        is_active=False,
        description="Unidirectional LSTM without bidirectional contextual context.",
    ),
]

CURATED_EXAMPLES = [
    ExampleSample(
        text="I can't believe how happy and delighted I am right now, this is truly a dream come true!",
        expected_emotion="joy",
        description="Celebration of personal achievement or milestone",
    ),
    ExampleSample(
        text="I feel completely alone, hollow, and hopeless about the future today.",
        expected_emotion="sadness",
        description="Expression of grief and profound sorrow",
    ),
    ExampleSample(
        text="I cherish every single moment with you, you mean the entire world to my heart.",
        expected_emotion="love",
        description="Deep affection, warmth, and romantic or familial bond",
    ),
    ExampleSample(
        text="I am absolutely furious that they broke their promise and lied straight to our faces!",
        expected_emotion="anger",
        description="Frustration, betrayal, and boiling anger",
    ),
    ExampleSample(
        text="My heart is pounding in panic and I am terrified of walking alone in this dark alley.",
        expected_emotion="fear",
        description="Acute anxiety, dread, and danger",
    ),
    ExampleSample(
        text="I was completely shocked and stunned when everybody yelled happy birthday!",
        expected_emotion="surprise",
        description="Sudden startling or unexpected event",
    ),
]

class ModelService:
    def __init__(self):
        self.artifacts_dir = self._find_artifacts_dir()
        self.tokenizer = None
        self.models: Dict[str, tf.keras.Model] = {}
        self.load_artifacts()

    def _find_artifacts_dir(self) -> Path:
        env_path = os.getenv("ARTIFACTS_DIR")
        if env_path and Path(env_path).exists():
            return Path(env_path)

        candidates = [
            Path(__file__).resolve().parent.parent.parent / "ml" / "artifacts",
            Path(__file__).resolve().parent.parent / "ml" / "artifacts",
            Path.cwd() / "ml" / "artifacts",
            Path.cwd().parent / "ml" / "artifacts",
        ]
        for p in candidates:
            if p.exists() and (p / "tokenizer.pkl").exists():
                return p
        # fallback default
        return candidates[0]

    def load_artifacts(self):
        tokenizer_path = self.artifacts_dir / "tokenizer.pkl"
        if tokenizer_path.exists():
            with open(tokenizer_path, "rb") as f:
                self.tokenizer = pickle.load(f)
            print(f"[ModelService] Loaded tokenizer with {len(self.tokenizer.word_index)} vocabulary tokens from {tokenizer_path}")
        else:
            print(f"[ModelService] WARNING: tokenizer.pkl not found at {tokenizer_path}")

        # Load BiGRU (Production model - optimal performance and memory footprint)
        bigru_path = self.artifacts_dir / "BiGRU_model.keras"
        if bigru_path.exists():
            try:
                self.models["BiGRU"] = tf.keras.models.load_model(str(bigru_path))
                print(f"[ModelService] Loaded BiGRU model from {bigru_path}")
            except Exception as e:
                print(f"[ModelService] Error loading BiGRU: {e}")
        else:
            print(f"[ModelService] WARNING: BiGRU_model.keras not found at {bigru_path}")

    def get_model(self, model_name: str = "BiGRU") -> tf.keras.Model:
        if "BiGRU" in self.models:
            return self.models["BiGRU"]
        if self.models:
            first_key = list(self.models.keys())[0]
            return self.models[first_key]
        raise RuntimeError("No trained models are loaded in memory.")

    def tokenize_and_pad(self, texts: List[str]) -> np.ndarray:
        if not self.tokenizer:
            raise RuntimeError("Tokenizer is not loaded.")
        sequences = self.tokenizer.texts_to_sequences(texts)
        padded = pad_sequences(
            sequences,
            maxlen=MAX_SEQUENCE_LENGTH,
            padding="post",
            truncating="post"
        )
        return padded

    def extract_token_info(self, text: str) -> List[TokenInfo]:
        if not self.tokenizer:
            return []
        words = text.strip().split()
        token_infos = []
        for word in words:
            cleaned = word.lower().strip(".,!?;:\"'()[]{}")
            token_id = self.tokenizer.word_index.get(cleaned)
            token_infos.append(
                TokenInfo(
                    token=word,
                    token_id=token_id,
                    in_vocab=token_id is not None
                )
            )
        return token_infos

    def predict_single(self, text: str, model_name: str = "BiGRU") -> PredictResponse:
        start_time = time.perf_counter()
        active_model_name = "BiGRU"
        model = self.get_model(active_model_name)

        padded = self.tokenize_and_pad([text])
        raw_preds = model.predict(padded, verbose=0)[0]

        pred_idx = int(np.argmax(raw_preds))
        confidence = float(raw_preds[pred_idx])
        predicted_label = EMOTION_CLASSES[pred_idx]

        probabilities = [
            EmotionScore(
                label=EMOTION_CLASSES[i],
                score=float(raw_preds[i]),
                percentage=round(float(raw_preds[i]) * 100, 2),
            )
            for i in range(len(EMOTION_CLASSES))
        ]
        probabilities.sort(key=lambda x: x.score, reverse=True)

        tokens = self.extract_token_info(text)
        inference_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return PredictResponse(
            text=text,
            model_name=active_model_name,
            prediction=predicted_label,
            confidence=round(confidence, 4),
            probabilities=probabilities,
            tokens=tokens,
            inference_time_ms=inference_time_ms,
        )

    def predict_batch(self, texts: List[str], model_name: str = "BiGRU") -> BatchPredictResponse:
        start_time = time.perf_counter()
        active_model_name = "BiGRU"
        model = self.get_model(active_model_name)

        padded = self.tokenize_and_pad(texts)
        raw_preds = model.predict(padded, verbose=0)

        results: List[PredictResponse] = []
        emotion_counts: Dict[str, int] = {e: 0 for e in EMOTION_CLASSES}

        for i, text in enumerate(texts):
            pred_vec = raw_preds[i]
            pred_idx = int(np.argmax(pred_vec))
            confidence = float(pred_vec[pred_idx])
            label = EMOTION_CLASSES[pred_idx]
            emotion_counts[label] += 1

            probs = [
                EmotionScore(
                    label=EMOTION_CLASSES[j],
                    score=float(pred_vec[j]),
                    percentage=round(float(pred_vec[j]) * 100, 2),
                )
                for j in range(len(EMOTION_CLASSES))
            ]
            probs.sort(key=lambda x: x.score, reverse=True)

            tokens = self.extract_token_info(text)

            results.append(
                PredictResponse(
                    text=text,
                    model_name=active_model_name,
                    prediction=label,
                    confidence=round(confidence, 4),
                    probabilities=probs,
                    tokens=tokens,
                    inference_time_ms=0.0,
                )
            )

        total_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return BatchPredictResponse(
            model_name=active_model_name,
            results=results,
            total_samples=len(texts),
            emotion_distribution=emotion_counts,
            total_time_ms=total_time_ms,
        )

    def get_project_info(self) -> ProjectInfo:
        return ProjectInfo(
            project_name="DeepMood",
            version="1.0.0",
            description="Deep learning-powered sentiment and emotional nuance classifier comparing Bidirectional LSTM, Bidirectional GRU, and standard RNN architectures.",
            dataset={
                "name": "dair-ai/emotion",
                "source": "Hugging Face Datasets",
                "train_size": 16000,
                "validation_size": 2000,
                "test_size": 2000,
                "domain": "Twitter text messages labeled with 6 basic emotions",
            },
            classes=EMOTION_CLASSES,
            max_sequence_length=MAX_SEQUENCE_LENGTH,
            models=MODEL_BENCHMARKS,
            author_or_source="DeepMood Research & Engineering Team",
        )

# Global singleton
model_service = ModelService()
