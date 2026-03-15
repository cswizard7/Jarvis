import { Moon, AlertTriangle, CheckCircle } from 'lucide-react'
import GlassCard from './GlassCard'

interface Props {
  nightUsage: number | null  // value from backend is in MINUTES
}

export default function SleepRiskCard({ nightUsage }: Props) {
  // FIX (Bug 7): Old threshold was > 0.5 minutes = 30 seconds.
  // Any tiny amount of night usage would show "Elevated".
  // Fixed to > 30 minutes which is a meaningful threshold.
  const isElevated = nightUsage !== null && nightUsage > 30

  return (
    <GlassCard className="p-6 flex flex-col justify-between h-full">
      <div className="absolute inset-0 bg-indigo-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
      <div className="relative z-10 flex justify-between items-start mb-6">
        <h3 className="text-gray-400 font-medium">Sleep Risk</h3>
        <div className="p-2.5 bg-indigo-500/10 rounded-xl">
          <Moon className="w-5 h-5 text-indigo-400" />
        </div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${isElevated ? 'bg-amber-500/10' : 'bg-green-500/10'}`}>
            {isElevated
              ? <AlertTriangle className="w-5 h-5 text-amber-500" />
              : <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>
          <span className="text-xl font-bold text-white">
            {nightUsage === null ? 'Loading...' : isElevated ? 'Elevated' : 'Normal'}
          </span>
        </div>
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
          <p className="text-sm text-gray-300">
            {nightUsage === null
              ? 'Fetching night usage data...'
              : isElevated
                ? <><span className="text-amber-400 font-semibold mb-1 block">Late Night Usage Detected</span>{nightUsage.toFixed(0)}m active past 10 PM.</>
                : <><span className="text-green-400 font-semibold mb-1 block">Sleep Schedule On Track</span>Only {nightUsage.toFixed(0)}m of night usage detected.</>
            }
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
