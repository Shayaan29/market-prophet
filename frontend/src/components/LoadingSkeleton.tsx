function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex gap-2">
        <div className="h-8 w-16 rounded-full bg-slate-800" />
        <div className="h-8 w-16 rounded-full bg-slate-800" />
        <div className="h-8 w-16 rounded-full bg-slate-800" />
      </div>
      <div className="h-80 rounded-lg bg-slate-900 ring-1 ring-slate-800" />
      <div className="mt-4 h-24 rounded-lg bg-slate-900 ring-1 ring-slate-800" />
    </div>
  )
}

export default LoadingSkeleton
