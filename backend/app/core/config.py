"""
Application configuration.

All settings are loaded from environment variables (via .env in dev).
Never hardcode secrets — add them to .env and reference here.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # ── App ────────────────────────────────────────────────────
    APP_NAME: str = "MarketProphet API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"  # development | staging | production

    # ── API ────────────────────────────────────────────────────
    API_V1_PREFIX: str = "/api/v1"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]  # React dev server

    # ── Database ───────────────────────────────────────────────
    DATABASE_URL: str = "sqlite+aiosqlite:///./marketprophet.db"
    # For production, set to: postgresql+asyncpg://user:pass@host/db

    # ── Redis ──────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379"
    CACHE_TTL_SECONDS: int = 900  # 15 minutes

    # ── ML ─────────────────────────────────────────────────────
    MODEL_DIR: str = "./app/ml/exports"
    DEFAULT_SEQUENCE_LENGTH: int = 60  # timesteps fed to LSTM

    # ── External APIs ──────────────────────────────────────────
    COINGECKO_BASE_URL: str = "https://api.coingecko.com/api/v3"
    COINGECKO_API_KEY: str = ""  # free tier: leave empty

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance — imported throughout the app."""
    return Settings()
