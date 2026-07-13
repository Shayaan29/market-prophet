import { useEffect, useState } from 'react'
import { getMarkets } from '../api'
import type { MarketCoin } from '../api'
import TopMovers from '../components/TopMovers'
import MarketList from '../components/MarketList'
import MarketListSkeleton from '../components/MarketListSkeleton'

function HomePage() {
  const [coins, setCoins] = useState<MarketCoin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMarkets(50)
      .then(data => {
        setCoins(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load market data.')
        setLoading(false)
      })
  }, [])

  if (loading) return <MarketListSkeleton />
  if (error) return <p className="text-red-400">{error}</p>

  return (
    <>
      <TopMovers coins={coins} />
      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-400">
          Markets
        </h2>
        <MarketList coins={coins} />
      </section>
    </>
  )
}

export default HomePage
