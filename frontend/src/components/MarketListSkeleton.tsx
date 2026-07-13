function MarketListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-3 h-4 w-32 rounded bg-slate-800" />
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-slate-900 ring-1 ring-slate-800" />
        ))}
      </div>
      <div className="h-96 rounded-lg bg-slate-900 ring-1 ring-slate-800" />
    </div>
  )
}

export default MarketListSkeleton
