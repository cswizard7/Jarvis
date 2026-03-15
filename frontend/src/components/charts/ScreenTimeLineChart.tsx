import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import GlassCard from '../dashboard/GlassCard'
import { useEffect, useState } from 'react'
import { fetchHistory } from '../../api'

export default function ScreenTimeLineChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // FIX: Track error state so we can show a helpful message instead of an empty chart
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
        <h3 className="text-white font-bold text-lg">Screen Time Trend</h3>
        <p className="text-gray-400 text-sm">Daily hours spent on devices</p>
      </div>
      <div className="grow min-h-[300px] w-full flex items-center justify-center">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-gray-400 text-sm">Could not load data. Is the backend running?</p>
        ) : isEmpty ? (
          // FIX: Was rendering an empty Recharts chart with no data, which shows
          // nothing but a blank area. Now shows a proper empty state message.
          <p className="text-gray-400 text-sm">No history yet. Run the tracker for a few days.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#06B6D4' }}
                // FIX: Format tooltip value to show "Xh Ym" instead of raw minutes
                formatter={(value: number) => {
                  const h = Math.floor(value / 60)
                  const m = Math.round(value % 60)
                  return [`${h}h ${m}m`, 'Screen Time']
                }}
              />
              <Area type="monotone" dataKey="screen_time" stroke="#06B6D4" fillOpacity={1} fill="url(#colorTime)" strokeWidth={4}
                dot={{ fill: '#1E293B', stroke: '#06B6D4', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#06B6D4', stroke: '#fff', strokeWidth: 2 }} animationDuration={1500} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </GlassCard>
  )
}
