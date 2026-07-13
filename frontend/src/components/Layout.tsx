import { Outlet } from 'react-router-dom'
import Header from './Header'

function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 px-8 py-8 font-sans">
      <div className="mx-auto max-w-4xl">
        <Header />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
