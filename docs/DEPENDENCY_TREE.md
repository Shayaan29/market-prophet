# Dependency Tree

## Backend (Python)

```
FastAPI 0.111
├── uvicorn          — ASGI server (runs the app)
├── pydantic         — data validation (built into FastAPI)
└── starlette        — HTTP layer (built into FastAPI)

SQLAlchemy 2.0
└── alembic          — database migrations

Database Drivers
├── psycopg2-binary  — PostgreSQL (production)
└── aiosqlite        — SQLite async (development)

Redis
└── hiredis          — faster Redis C parser

ML Stack
├── tensorflow 2.15
│   └── keras        — model loading + inference
├── numpy            — array operations
├── pandas           — data manipulation
└── scikit-learn     — preprocessing (MinMaxScaler)

HTTP
└── httpx            — async HTTP client (CoinGecko calls)

Config
├── pydantic-settings — typed env var loading
└── python-dotenv    — .env file support

Dev/Testing
├── pytest           — test runner
├── pytest-asyncio   — async test support
├── black            — code formatter
├── flake8           — linter
└── isort            — import sorter
```

## Frontend (Node/React)

```
React 18
├── react-dom        — DOM rendering
└── react-router-dom — client-side routing

TypeScript 5
└── @types/*         — type definitions

Chart.js 4
└── react-chartjs-2  — React wrapper for Chart.js

TailwindCSS 3
└── postcss          — CSS processing

Build
└── vite             — dev server + bundler (faster than CRA)

Testing
├── vitest           — test runner (Vite-native)
└── @testing-library/react  — component testing

Linting
├── eslint           — linter
└── prettier         — formatter
```

## Infrastructure

```
Docker
├── docker-compose   — local multi-service orchestration
└── nginx            — reverse proxy + SSL termination

CI/CD (GitHub Actions)
├── actions/checkout
├── actions/setup-python
├── actions/setup-node
└── amondnet/vercel-action

Deployment (Phase 2)
├── Railway          — backend hosting (FastAPI)
├── Vercel           — frontend hosting (React)
├── Supabase         — managed PostgreSQL
└── Upstash          — managed Redis
```

## Upgrade Path

| Component | Phase 1 (now) | Phase 2 | Phase 3 |
|---|---|---|---|
| DB | SQLite | PostgreSQL | PostgreSQL + read replicas |
| Cache | None | Redis | Redis Cluster |
| Server | Local | Railway | AWS ECS |
| Model format | .h5 | .h5 | ONNX |
| Auth | None | JWT | OAuth2 (Google/GitHub) |
