#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# setup.sh — One-command local dev setup
# Usage: bash scripts/setup.sh
# ─────────────────────────────────────────────────────────────────

set -e  # exit on any error

echo "🚀 Setting up MarketProphet..."

# Check prerequisites
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 required"; exit 1; }
command -v node    >/dev/null 2>&1 || { echo "❌ Node.js required"; exit 1; }

# Copy env file
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example — fill in your values"
fi

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --quiet -r requirements.txt
echo "✅ Backend ready"
cd ..

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd frontend
npm install --silent
echo "✅ Frontend ready"
cd ..

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start:"
echo "  Backend:  cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "API docs: http://localhost:8000/docs"
echo "App:      http://localhost:3000"
