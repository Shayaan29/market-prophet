# MarketProphet 📈

> AI-powered crypto & stock market prediction platform with real-time analytics.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Chart.js, TailwindCSS |
| Backend | Python, FastAPI, SQLAlchemy |
| ML | TensorFlow/Keras (LSTM), Google Colab (training) |
| Database | PostgreSQL (prod), SQLite (dev) |
| Cache | Redis |
| Infra | Docker, Nginx, GitHub Actions |

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker & Docker Compose (optional but recommended)

### 1. Clone & Setup
```bash
git clone https://github.com/yourorg/market-prophet.git
cd market-prophet
cp .env.example .env        # fill in your values
```

### 2. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev                  # runs on http://localhost:3000
```

### 4. Full Stack (Docker)
```bash
docker-compose up --build
```

## Project Structure
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full system design.

## Contributing
See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) before opening a PR.

## Team
| Role | Responsibility |
|---|---|
| ML Engineer | Model training, Colab notebooks, exports |
| Backend Dev | FastAPI, DB, prediction endpoints |
| Frontend Dev | React UI, Chart.js, API integration |
