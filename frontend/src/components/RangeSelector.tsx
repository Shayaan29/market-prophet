const RANGES = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 },
]

interface RangeSelectorProps {
  days: number
  onChange: (days: number) => void
}

function RangeSelector({ days, onChange }: RangeSelectorProps) {
  return (
    <div className="mb-3 flex gap-1">
      {RANGES.map(range => (
        <button
          key={range.days}
          onClick={() => onChange(range.days)}
          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
            days === range.days
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}

export default RangeSelector
