import { Smartphone, TrendingDown } from 'lucide-react'
import GlassCard from './GlassCard'

interface Props {
  screenTime: number | null  // value from backend is in MINUTES
  breaks: number | null
}

export default function ScreenTimeCard({ screenTime, breaks }: Props) {
  // FIX (Bug 6): Backend sends screen_time in MINUTES.
  // Old code did Math.floor(screenTime) which treated minutes as hours,
  // showing e.g. "50h 35m" instead of "0h 51m".
  // Correct: divide by 60 to get hours, use remainder for minutes.
  const hours = screenTime !== null ? Math.floor(screenTime / 60) : null
  const mins = screenTime !== null ? Math.round(screenTime % 60) : null

  return (
    <GlassCard className="p-6 flex flex-col justify-between h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#06B6D4]/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110" />
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-gray-400 font-medium z-10">Screen Time</h3>
        <div className="p-2.5 bg-[#06B6D4]/10 rounded-xl z-10">
          <Smartphone className="w-5 h-5 text-[#06B6D4]" />
        </div>
      </div>
      <div className="z-10">
        <div className="flex flex-col gap-2 mb-2">
          <span className="text-4xl font-bold tracking-tight">
            {screenTime !== null ? `${hours}h ${mins}m` : '-- h --m'}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center text-sm font-medium text-[#22C55E] bg-[#22C55E]/10 px-2 py-1 rounded-md">
              <TrendingDown className="w-4 h-4 mr-1" />
              Live
            </span>
            <span className="text-sm text-gray-500">
              {breaks !== null ? `${breaks} breaks taken` : 'loading...'}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-10 opacity-30">
        <svg viewBox="0 0 100 25" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,25 C20,15 40,25 60,10 C80,20 100,5 100,5 L100,25 L0,25 Z" fill="#06B6D4" opacity="0.3" />
          <path d="M0,25 C20,15 40,25 60,10 C80,20 100,5 100,5" fill="none" stroke="#06B6D4" strokeWidth="2" />
        </svg>
      </div>
    </GlassCard>
  )
}
