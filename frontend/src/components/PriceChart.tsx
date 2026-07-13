import { useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import type { PriceHistory, Prediction } from '../api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, zoomPlugin)

// Draws a vertical dashed line through the hovered point, like a
// trading-terminal crosshair.
const crosshairPlugin = {
  id: 'crosshair',
  afterDraw(chart: ChartJS) {
    const active = chart.tooltip?.getActiveElements()
    if (!active || active.length === 0) return

    const { ctx, chartArea } = chart
    const x = active[0].element.x
    ctx.save()
    ctx.beginPath()
    ctx.setLineDash([4, 4])
    ctx.moveTo(x, chartArea.top)
    ctx.lineTo(x, chartArea.bottom)
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'
    ctx.stroke()
    ctx.restore()
  }
}

interface PriceChartProps {
  prices: PriceHistory | null
  prediction: Prediction | null
  assetSymbol: string
  days: number
}

function formatLabel(timestamp: string, days: number) {
  const date = new Date(timestamp)
  return days <= 1
    ? date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function rangeText(days: number) {
  if (days <= 1) return 'Last 24 Hours'
  if (days <= 7) return 'Last 7 Days'
  if (days <= 30) return 'Last 30 Days'
  if (days <= 90) return 'Last 90 Days'
  return 'Last Year'
}

function PriceChart({ prices, prediction, assetSymbol, days }: PriceChartProps) {
  const chartRef = useRef<ChartJS<'line'> | null>(null)

  // Discard any zoom/pan from the previous range so switching timeframes
  // doesn't leave the chart stuck on a stale zoomed-in window.
  useEffect(() => {
    chartRef.current?.resetZoom()
  }, [prices])

  const historyLabels = prices?.prices.map(p => formatLabel(p.timestamp, days)) ?? []

  const labels = prediction
    ? [...historyLabels, formatLabel(prediction.prediction_for_date, days)]
    : historyLabels

  const datasets = [
    {
      label: `${assetSymbol} Price (USD)`,
      data: prices?.prices.map(p => p.price),
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56, 189, 248, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#38bdf8',
      fill: true,
      tension: 0.3,
    },
    ...(prediction
      ? [{
          label: 'Predicted Price',
          data: [
            ...Array(prices?.prices.length ?? 0).fill(null),
            prediction.predicted_price
          ],
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.3)',
          borderWidth: 2,
          pointRadius: 8,
          pointBackgroundColor: '#34d399',
          fill: false,
        }]
      : [])
  ]

  const chartData = { labels, datasets }

  const chartOptions = {
    responsive: true,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#cbd5e1' }
      },
      title: {
        display: true,
        text: `${assetSymbol} — ${rangeText(days)}`,
        color: '#e2e8f0'
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) =>
            ctx.parsed.y === null
              ? ''
              : `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
        }
      },
      zoom: {
        pan: { enabled: true, mode: 'x' as const },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x' as const,
        },
        limits: { x: { minRange: 5 } }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', maxRotation: 0, autoSkip: true },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      },
      y: {
        ticks: {
          color: '#94a3b8',
          callback: (value: number | string) => `$${Number(value).toLocaleString()}`
        },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      }
    }
  }

  return (
    <div className="rounded-lg bg-slate-900 p-4 shadow-lg shadow-black/20 ring-1 ring-slate-800">
      <div className="mb-2 flex justify-end">
        <button
          onClick={() => chartRef.current?.resetZoom()}
          className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-400 hover:bg-slate-700 hover:text-slate-200"
        >
          Reset Zoom
        </button>
      </div>
      <Line ref={chartRef} data={chartData} options={chartOptions} plugins={[crosshairPlugin]} />
      <p className="mt-2 text-center text-xs text-slate-500">
        Scroll to zoom, drag to pan
      </p>
    </div>
  )
}

export default PriceChart
