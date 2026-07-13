import { Link } from 'react-router-dom'
import type { MarketCoin } from '../api'

interface MarketListProps {
  coins: MarketCoin[]
}

function formatPrice(price: number) {
  return `$${price.toLocaleString(undefined, { maximumFractionDigits: price < 1 ? 6 : 2 })}`
}

function ChangeBadge({ change }: { change: number | null }) {
  if (change === null) return <span className="text-slate-500">—</span>
  const isPositive = change >= 0
  return (
    <span className={isPositive ? 'text-emerald-400' : 'text-red-400'}>
      {isPositive ? '+' : ''}{change.toFixed(2)}%
    </span>
  )
}

function MarketList({ coins }: MarketListProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-slate-900 ring-1 ring-slate-800">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400">
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Coin</th>
            <th className="px-4 py-3 font-medium text-right">Price</th>
            <th className="px-4 py-3 font-medium text-right">24h</th>
          </tr>
        </thead>
        <tbody>
          {coins.map(coin => (
            <tr key={coin.id} className="border-b border-slate-800/50 last:border-0">
              <td className="px-4 py-3 text-slate-500">{coin.market_cap_rank ?? '—'}</td>
              <td className="px-4 py-3">
                <Link
                  to={`/asset/${coin.id}`}
                  className="flex items-center gap-3 text-slate-100 no-underline hover:text-emerald-400"
                >
                  <img src={coin.image} alt="" className="h-6 w-6 rounded-full" />
                  <span className="font-medium">{coin.name}</span>
                  <span className="text-slate-500">{coin.symbol}</span>
                </Link>
              </td>
              <td className="px-4 py-3 text-right text-slate-100">{formatPrice(coin.current_price)}</td>
              <td className="px-4 py-3 text-right">
                <ChangeBadge change={coin.price_change_percentage_24h} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MarketList
