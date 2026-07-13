import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getMarkets, getPriceHistory, getPrediction } from '../api'
import type { MarketCoin, PriceHistory, Prediction } from '../api'
import PriceChart from '../components/PriceChart'
import PredictionCard from '../components/PredictionCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import RangeSelector from '../components/RangeSelector'

// Keyed by assetId in the parent so this remounts (and its state resets
// to the initial values below) whenever the route param changes, instead
// of manually resetting state inside the effect.
function AssetDetailView({ assetId }: { assetId: string }) {
  const [coin, setCoin] = useState<MarketCoin | null>(null)
  const [prices, setPrices] = useState<PriceHistory | null>(null)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Coin metadata + prediction only depend on the asset, not the selected
  // time range, so they're fetched once per asset.
  useEffect(() => {
    getMarkets(250).then(coins => {
      setCoin(coins.find(c => c.id === assetId) ?? null)
    })

    getPrediction(assetId)
      .then(setPrediction)
      .catch(() => setPrediction(null))
  }, [assetId])

  // Price history refetches whenever the selected range changes. The
  // "start loading" flag is set from the RangeSelector's click handler
  // (see handleRangeChange) rather than here, so this effect only ever
  // calls setState from inside the async .then/.catch — calling it
  // synchronously in the effect body causes an extra cascading render.
  useEffect(() => {
    getPriceHistory(assetId, days)
      .then(priceData => {
        setPrices(priceData)
        setError(null)
      })
      .catch(() => {
        setError('Could not load price data for this asset.')
      })
      .finally(() => {
        setLoading(false)
        setChartLoading(false)
      })
  }, [assetId, days])

  function handleRangeChange(newDays: number) {
    setChartLoading(true)
    setDays(newDays)
  }

  return (
    <>
      <Link to="/" className="mb-4 inline-block text-sm text-slate-400 no-underline hover:text-slate-200">
        ← Back to Markets
      </Link>

      <div className="mb-4 flex items-center gap-3">
        {coin && <img src={coin.image} alt="" className="h-8 w-8 rounded-full" />}
        <h2 className="m-0 text-xl font-semibold text-slate-100">
          {coin ? `${coin.name} (${coin.symbol})` : assetId}
        </h2>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <>
          <RangeSelector days={days} onChange={handleRangeChange} />
          <div className={chartLoading ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
            <PriceChart
              prices={prices}
              prediction={prediction}
              assetSymbol={coin?.symbol ?? assetId}
              days={days}
            />
          </div>
          {prediction && <PredictionCard prediction={prediction} />}
        </>
      )}
    </>
  )
}

function AssetDetailPage() {
  const { assetId } = useParams<{ assetId: string }>()
  if (!assetId) return null
  return <AssetDetailView key={assetId} assetId={assetId} />
}

export default AssetDetailPage
