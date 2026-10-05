// All backend calls go through this file.
// VITE_API_BASE_URL is set at build time (e.g. in Vercel's project
// settings) to point at the deployed backend; it falls back to the local
// dev API when unset.
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}/api/v1`

// fetch() only rejects on network failure, not HTTP error status codes —
// without this, a 404/500 response resolves "successfully" with a body
// shaped nothing like the expected type.
async function parseJsonOrThrow(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.detail ?? `Request failed with status ${res.status}`)
  }
  return res.json()
}

export interface PricePoint {
  timestamp: string
  price: number
}

export interface PriceHistory {
  asset_id: string
  prices: PricePoint[]
}

// Fetch price history for one asset
export async function getPriceHistory(assetId: string, days = 30): Promise<PriceHistory> {
  const res = await fetch(`${BASE_URL}/prices/${assetId}?days=${days}`)
  return parseJsonOrThrow(res)
}

export interface Prediction {
  asset_id: string
  asset_symbol: string
  predicted_price: number
  confidence: number
  prediction_for_date: string
}

export async function getPrediction(assetId: string): Promise<Prediction> {
  const res = await fetch(`${BASE_URL}/predict/${assetId}`)
  return parseJsonOrThrow(res)
}

export interface MarketCoin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number | null
  price_change_percentage_24h: number | null

}

// Fetch top coins by market cap, for browsing (no prediction model required)
export async function getMarkets(limit = 50): Promise<MarketCoin[]> {
  const res = await fetch(`${BASE_URL}/markets/?limit=${limit}`)
  const data = await parseJsonOrThrow(res)
  return data.coins
}