import type { Prediction } from '../api'

interface PredictionCardProps {
  prediction: Prediction
}

function PredictionCard({ prediction }: PredictionCardProps) {
  return (
    <div className="mt-4 rounded-lg border-l-4 border-emerald-500 bg-emerald-500/10 p-4">
      <h3 className="m-0 text-sm font-medium text-slate-300">Tomorrow's Prediction</h3>
      <p className="my-2 text-3xl font-bold text-emerald-400">
        ${prediction.predicted_price.toLocaleString()}
      </p>
      <p className="m-0 text-sm text-slate-400">
        Confidence: {Math.round(prediction.confidence * 100)}%
      </p>
    </div>
  )
}

export default PredictionCard
