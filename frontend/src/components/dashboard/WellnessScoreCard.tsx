import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import GlassCard from './GlassCard'

interface Props {
  score?: number
  // FIX: Accept dynamic label from Dashboard instead of always showing "Optimal Range"
  label?: string
}

export default function WellnessScoreCard({ score = 0, label }: Props) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)

  useEffect(() => {
    const animation = animate(count, score, { duration: 2, ease: "circOut" })
    return animation.stop
  }, [score, count])

  // Ring and label colour changes based on score
  const labelColor =
    score >= 80 ? 'text-[#22C55E] bg-[#22C55E]/10' :
    score >= 60 ? 'text-[#06B6D4] bg-[#06B6D4]/10' :
    score >= 40 ? 'text-[#F59E0B] bg-[#F59E0B]/10' :
                  'text-[#EF4444] bg-[#EF4444]/10'

  const ringColor =
    score >= 80 ? 'text-[#22C55E]' :
    score >= 60 ? 'text-[#06B6D4]' :
    score >= 40 ? 'text-[#F59E0B]' :
                  'text-[#EF4444]'

  return (
    <GlassCard className="p-6 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[#4F46E5]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <h3 className="text-gray-400 font-medium mb-4 self-start">Wellness Score</h3>
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle className="text-gray-700/50" strokeWidth="10" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
          <motion.circle
            className={ringColor}
            strokeWidth="10"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="70"
            cx="80"
            cy="80"
            initial={{ strokeDasharray: "0 440" }}
            animate={{ strokeDasharray: `${(score / 100) * 440} 440` }}
            transition={{ duration: 2, ease: "circOut" }}
          />
        </svg>
        <motion.div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-300">
          {rounded}
        </motion.div>
      </div>
      <p className={`mt-6 text-sm font-medium px-4 py-1.5 rounded-full z-10 ${labelColor}`}>
        {label ?? (score === 0 ? 'Loading...' : 'Optimal Range')}
      </p>
    </GlassCard>
  )
}
