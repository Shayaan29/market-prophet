"""
Pydantic schemas for prediction request/response.
These define exactly what the API accepts and returns — acts as a contract
between frontend and backend. Change these carefully.
"""

from pydantic import BaseModel, Field
from datetime import datetime


class PredictionResponse(BaseModel):
    asset_id: str = Field(example="bitcoin")
    asset_symbol: str = Field(example="BTC")
    predicted_price: float = Field(description="Predicted closing price in USD")
    confidence: float = Field(ge=0.0, le=1.0, description="Model confidence 0–1")
    prediction_for_date: datetime = Field(description="The date this prediction is for")
    model_version: str = Field(example="lstm-v1.0")
    generated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "asset_id": "bitcoin",
                "asset_symbol": "BTC",
                "predicted_price": 68500.42,
                "confidence": 0.78,
                "prediction_for_date": "2025-06-23T00:00:00",
                "model_version": "lstm-v1.0",
                "generated_at": "2025-06-22T14:30:00",
            }
        }
