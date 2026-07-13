import { Link } from 'react-router-dom'
import type { MarketCoin } from '../api'

interface TopMoversProps {
  coins: MarketCoin[]
}

function TopMovers({ coins }: TopMoversProps) {
  const topGainers = [...coins]
    .filter(coin => coin.price_change_percentage_24h !== null)
    .sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0))
    .slice(0, 5)

  if (topGainers.length === 0) return null

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-400">
        Top Movers (24h)
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {topGainers.map(coin => (
          <Link
            key={coin.id}
            to={`/asset/${coin.id}`}
            className="rounded-lg bg-slate-900 p-3 text-center no-underline ring-1 ring-slate-800 transition-colors hover:ring-emerald-500/50"
          >
            <img src={coin.image} alt="" className="mx-auto mb-2 h-8 w-8 rounded-full" />
            <p className="m-0 truncate text-sm font-medium text-slate-100">{coin.symbol}</p>
            <p className="m-0 text-sm text-emerald-400">
              +{coin.price_change_percentage_24h?.toFixed(2)}%
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default TopMovers
