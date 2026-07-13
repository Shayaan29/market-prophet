import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="mb-8 flex items-center gap-3">
      <Link to="/" className="flex items-center gap-3 no-underline">
        <span className="text-3xl">📈</span>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
          MarketProphet
        </h1>
      </Link>
    </header>
  )
}

export default Header
