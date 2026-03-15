import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);

export default function HourlyHeatmap() {
  const [heatmapData, setHeatmapData] = useState<{ day: number, hour: number, intensity: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // FIX: Was missing fallback — if VITE_API_URL is undefined this became
    // "undefined/api/heatmap" and silently failed. Now falls back to localhost:5000.
    fetch(`${API_URL}/api/heatmap`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch heatmap')
        return r.json()
      })
      .then(setHeatmapData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const getColor = (intensity: number) => `rgba(6, 182, 212, ${intensity})`

  return (
    <div className="glass p-6 rounded-2xl flex flex-col h-full w-full overflow-hidden">
      <div className="mb-6">
        <h3 className="text-white font-bold text-lg">Hourly Usage Heatmap</h3>
        <p className="text-gray-400 text-sm">Intensity of phone usage across the week</p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Could not load heatmap. Is the tracker running?</p>
        </div>
      ) : (
        <div className="grow flex flex-col min-w-[500px] overflow-x-auto overflow-y-hidden pb-2">
          <div className="flex ml-[42px] mb-2">
            {hours.filter(h => h % 4 === 0).map(h => (
              <div key={h} className="flex-1 text-xs text-gray-500" style={{ width: `${100/6}%` }}>
                {h}:00
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-1.5 select-none">
            {dayNames.map((day, dIdx) => (
              <div key={day} className="flex flex-1 items-stretch gap-1.5 group">
                <span className="w-9 text-xs text-gray-400 font-medium group-hover:text-white transition-colors flex items-center">
                  {day}
                </span>
                <div className="flex flex-1 gap-1.5 h-full">
                  {hours.map(h => {
                    const val = heatmapData.find(v => v.day === dIdx && v.hour === h)
                    const intensity = val?.intensity ?? 0
                    return (
                      <div
                        key={`${dIdx}-${h}`}
                        className="flex-1 rounded-[2px] transition-all duration-300 hover:scale-[1.3] hover:z-10 cursor-pointer"
                        style={{ backgroundColor: getColor(intensity) }}
                        title={`${day} ${h}:00 — ${(intensity * 100).toFixed(0)}% activity`}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-500">
        <span>Less</span>
        <div className="w-24 h-2 rounded bg-gradient-to-r from-[rgba(6,182,212,0.1)] to-cyan-500" />
        <span>More</span>
      </div>
    </div>
  )
}
