"""
PredictionService — Loads ML model and runs inference.

Responsibilities:
  - Load the correct .h5 model for the requested asset
  - Fetch recent prices to build the input sequence
  - Run model inference
  - Return structured prediction with confidence

Phase 1: Loads model fresh on each request (simple, slightly slow).
Phase 2: Cache loaded models in memory at startup.
"""

import os
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path

from app.core.config import get_settings
from app.schemas.prediction import PredictionResponse
from app.services.data_service import DataService

settings = get_settings()


class PredictionService:

    def __init__(self):
        self.data_service = DataService()

    async def predict(self, asset_id: str) -> PredictionResponse | None:
        """
        Run a next-day price prediction for the given asset.

        Args:
            asset_id: e.g. 'bitcoin'

        Returns:
            PredictionResponse or None if no model exists for this asset.
        """
        model = self._load_model(asset_id)
        if model is None:
            return None

        # Fetch the last 60 days of prices as model input
        history = await self.data_service.get_price_history(
            asset_id=asset_id,
            days=settings.DEFAULT_SEQUENCE_LENGTH + 5  # buffer for weekends/gaps
        )

        prices = [p.price for p in history.prices][-settings.DEFAULT_SEQUENCE_LENGTH:]

        if len(prices) < settings.DEFAULT_SEQUENCE_LENGTH:
            return None  # Not enough data

        # Normalise → predict → denormalise
        price_array = np.array(prices)
        min_price, max_price = price_array.min(), price_array.max()
        normalised = (price_array - min_price) / (max_price - min_price)

        model_input = normalised.reshape(1, settings.DEFAULT_SEQUENCE_LENGTH, 1)
        raw_prediction = float(model.predict(model_input, verbose=0)[0][0])

        # Denormalise back to USD
        predicted_price = raw_prediction * (max_price - min_price) + min_price

        return PredictionResponse(
            asset_id=asset_id,
            asset_symbol=asset_id[:3].upper(),  # naive; improve with asset registry
            predicted_price=round(predicted_price, 2),
            confidence=0.75,  # Phase 1: static. Phase 2: derive from model uncertainty.
            prediction_for_date=datetime.utcnow() + timedelta(days=1),
            model_version="lstm-v1.0",
        )

    def _load_model(self, asset_id: str):
        """
        Load .h5 model for the given asset from the exports directory.
        Returns None if no model file exists.
        """
        # Lazy import — only load TensorFlow if a model is actually needed
        try:
            from tensorflow.keras.models import load_model
        except ImportError:
            raise RuntimeError("TensorFlow not installed. Run: pip install tensorflow")

        model_path = Path(settings.MODEL_DIR) / f"{asset_id}_lstm.h5"

        if not model_path.exists():
            return None

        return load_model(str(model_path))
