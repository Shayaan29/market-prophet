# System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│   React + TypeScript   │   Chart.js   │   TailwindCSS       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST
┌──────────────────────────────▼──────────────────────────────┐
│                       API GATEWAY (Nginx)                    │
│        Rate limiting │ SSL termination │ Load balancing      │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     BACKEND (FastAPI)                        │
│  /api/v1/predict  │  /api/v1/prices  │  /api/v1/assets      │
└──────┬──────────────────────┬────────────────────┬──────────┘
       │                      │                    │
┌──────▼──────┐   ┌──────────▼──────┐   ┌────────▼──────────┐
│  ML Service │   │   Data Service  │   │   Cache (Redis)   │
│  LSTM model │   │  CoinGecko API  │   │  15min TTL prices │
│  inference  │   │  Alpha Vantage  │   │                   │
└─────────────┘   └─────────────────┘   └───────────────────┘
                               │
                  ┌────────────▼────────────┐
                  │    PostgreSQL Database   │
                  │  prices │ predictions   │
                  │  assets │ model_runs    │
                  └─────────────────────────┘

TRAINING PIPELINE (offline / Google Colab)
  Raw Data → Preprocessing → LSTM Training → Evaluation → Export .h5
```

## Data Flow

1. **Scheduled job** fetches prices from CoinGecko every 15 mins → stores in PostgreSQL
2. **User requests** prediction → backend checks Redis cache (fast path)
3. **Cache miss** → ML Service loads model → runs inference → caches result → returns JSON
4. **Frontend** receives JSON → renders Chart.js with historical + predicted prices

## Scalability Notes

- Phase 1 (now): SQLite + no Redis, single Flask/FastAPI instance, local model
- Phase 2: PostgreSQL + Redis, deployed on Railway/Render
- Phase 3: Multiple models per asset, model versioning, A/B testing
- Phase 4: WebSockets for live price streaming, user accounts

## Key Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| API framework | FastAPI over Flask | Async support, auto docs, better performance |
| Model format | .h5 (→ ONNX later) | Simple now, portable later |
| Versioned API | /api/v1/ prefix | Lets us ship /v2/ without breaking clients |
| Monorepo | Single repo | Easier for small team, shared types |
