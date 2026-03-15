import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GlassCard from '../dashboard/GlassCard'
import { useEffect, useState } from 'react'
import { fetchHistory } from '../../api'

export default function StressScatterPlot() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // FIX: Track error state — was silently showing empty chart on fetch failure
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchHistory()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  // FIX: Recharts ScatterChart needs at least 2 points to render meaningfully.
  // With 1 point it renders but looks broken. Show empty state instead.
  const isEmpty = !loading && !error && data.length < 2

  return (
    <GlassCard className="p-6 flex flex-col h-full w-full">
      <div className="mb-6">
        <h3 className="text-white font-bold text-lg">Stress vs Screen Time</h3>
        <p className="text-gray-400 text-sm">Correlation per day</p>
      </div>
      <div className="grow min-h-[300px] w-full flex items-center justify-center">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-gray-400 text-sm">Could not load data. Is the backend running?</p>
        ) : isEmpty ? (
          <p className="text-gray-400 text-sm">Need at least 2 days of data to show correlation.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                type="number"
                dataKey="screen_time"
                name="Screen Time"
                // FIX: Label axis as minutes since backend sends minutes, not hours
                label={{ value: 'Screen Time (min)', position: 'insideBottom', offset: -2, fill: '#6B7280', fontSize: 11 }}
                stroke="#6B7280"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="number"
                dataKey="stress"
                name="Stress"
                // FIX: Add human-readable stress level ticks (25=Low, 50=Medium, 80=High)
                ticks={[25, 50, 80]}
                tickFormatter={(v) => v === 25 ? 'Low' : v === 50 ? 'Med' : 'High'}
                stroke="#6B7280"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#EF4444' }}
                formatter={(value: number, name: string) => {
                  if (name === 'Stress') {
                    const label = value === 80 ? 'High' : value === 50 ? 'Medium' : 'Low'
                    return [label, 'Stress']
                  }
                  // FIX: Format screen time as Xh Ym in tooltip
                  const h = Math.floor(value / 60)
                  const m = Math.round(value % 60)
                  return [`${h}h ${m}m`, 'Screen Time']
                }}
              />
              <Scatter name="Days" data={data} fill="#EF4444" animationDuration={1500} />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </GlassCard>
  )
}
