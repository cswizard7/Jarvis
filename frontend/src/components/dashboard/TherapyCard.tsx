import { HeartHandshake, PlayCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import GlassCard from './GlassCard'

interface Props {
  therapy?: string
  message?: string
  spotify?: string
}

export default function TherapyCard({ therapy, message, spotify }: Props) {
  return (
    <GlassCard className="p-6 flex flex-col justify-between h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/10 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110" />
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-gray-400 font-medium z-10">Recommended Therapy</h3>
        <div className="p-2.5 bg-[#22C55E]/10 rounded-xl z-10">
          <HeartHandshake className="w-5 h-5 text-[#22C55E]" />
        </div>
      </div>
      <div className="z-10 flex flex-col grow justify-between">
        <div>
          <h4 className="text-xl font-bold text-white mb-2">
            {therapy ?? 'Loading...'}
          </h4>
          <p className="text-sm text-gray-400 mb-6">
            {message ?? 'Fetching your personalized recommendation.'}
          </p>
        </div>
        <Link
          to="/therapy"
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#22C55E]/20 hover:bg-[#22C55E]/30 text-[#22C55E] rounded-xl transition-colors font-semibold"
        >
          <PlayCircle className="w-5 h-5" />
          Start Session
        </Link>
      </div>
    </GlassCard>
  )
}