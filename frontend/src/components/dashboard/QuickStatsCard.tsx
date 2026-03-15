import { Coffee, Smartphone } from 'lucide-react'
import GlassCard from './GlassCard'

interface Props {
  breaks: number | null
  appSwitches: number | null
}

export default function QuickStatsCard({ breaks, appSwitches }: Props) {
  return (
    <GlassCard className="p-6 flex flex-col justify-between h-full">
      <h3 className="text-gray-400 font-medium mb-6">Quick Stats</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F59E0B]/10 rounded-lg">
              <Coffee className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <span className="font-medium text-gray-300">Breaks Taken</span>
          </div>
          <span className="text-xl font-bold">{breaks ?? '--'}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#06B6D4]/10 rounded-lg">
              <Smartphone className="w-4 h-4 text-[#06B6D4]" />
            </div>
            <span className="font-medium text-gray-300">App Switches</span>
          </div>
          <span className="text-xl font-bold">{appSwitches ?? '--'}</span>
        </div>
      </div>
    </GlassCard>
  )
}