import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import GlassCard from '../dashboard/GlassCard'
import { useEffect, useState } from 'react'
import { fetchHistory } from '../../api'

export default function CategoryBarChart() {
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

  const isEmpty = !loading && !error && data.length === 0

  return (
    <GlassCard className="p-6 flex flex-col h-full w-full">
      <div className="mb-6">
        <h3 className="text-white font-bold text-lg">Usage Categories</h3>
        <p className="text-gray-400 text-sm">Productive vs Entertainment (minutes)</p>
      </div>
      <div className="grow min-h-[300px] w-full flex items-center justify-center">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-gray-400 text-sm">Could not load data. Is the backend running?</p>
        ) : isEmpty ? (
          <p className="text-gray-400 text-sm">No history yet. Run the tracker for a few days.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProductive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.4}/>
                </linearGradient>
                <linearGradient id="colorEntertainment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                // FIX: Format minutes as "Xh Ym" for readability
                formatter={(value: number, name: string) => {
                  const h = Math.floor(value / 60)
                  const m = Math.round(value % 60)
                  return [`${h}h ${m}m`, name]
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', color: '#9CA3AF' }} />
              <Bar dataKey="productive" name="Productive" fill="url(#colorProductive)" radius={[4, 4, 0, 0]} animationDuration={1500} />
              <Bar dataKey="entertainment" name="Entertainment" fill="url(#colorEntertainment)" radius={[4, 4, 0, 0]} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </GlassCard>
  )
}
