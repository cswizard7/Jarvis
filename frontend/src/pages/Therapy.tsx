import { motion, type Variants } from 'framer-motion'
import BreathingAnimation from '../components/therapy/BreathingAnimation'
import MoodPlaylistSelector from '../components/therapy/MoodPlaylistSelector'
import { HeartHandshake } from 'lucide-react'
import { useJarvisData } from '../hooks/useJarvisData'

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

// FIX: Added "as const" to transition.type so TypeScript narrows it from
// string -> "spring" literal, satisfying Framer Motion's Variants type.
const item: Variants = {
  hidden: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
  show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
}

// Maps backend therapy value to MoodPlaylistSelector mood key
function getMood(therapy?: string): string {
  if (!therapy) return 'Relax'
  const t = therapy.toLowerCase()
  if (t.includes('focus')) return 'Focus'
  if (t.includes('meditation') || t.includes('breathing')) return 'Stress relief'
  if (t.includes('calm') || t.includes('nature')) return 'Relax'
  if (t.includes('sleep')) return 'Sleep'
  return 'Relax'
}

export default function Therapy() {
  const { data } = useJarvisData()
  const recommendedMood = getMood(data?.therapy)

  return (
    <motion.div
      className="p-8 max-w-7xl mx-auto h-full flex flex-col"
      variants={container} initial="hidden" animate="show"
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
    >
      <div className="mb-8 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#22C55E] to-[#4F46E5]">
            Relax & Recover
          </h1>
          <p className="text-gray-400 mt-2">Personalized sessions to improve your wellbeing.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 text-[#22C55E] rounded-xl font-medium border border-[#22C55E]/20">
          <HeartHandshake className="w-5 h-5" />
          <span>Recommended: {data?.therapy ?? 'Loading...'}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8 flex-1">
        <motion.div variants={item} className="h-[500px] flex flex-col">
          <BreathingAnimation />
        </motion.div>
        <motion.div variants={item} className="h-[500px] flex flex-col">
          <MoodPlaylistSelector initialMood={recommendedMood} />
        </motion.div>
      </div>
    </motion.div>
  )
}
