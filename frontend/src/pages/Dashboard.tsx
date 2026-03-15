import { motion, type Variants } from 'framer-motion'
import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import WellnessScoreCard from '../components/dashboard/WellnessScoreCard'
import StressGauge from '../components/dashboard/StressGauge'
import ScreenTimeCard from '../components/dashboard/ScreenTimeCard'
import QuickStatsCard from '../components/dashboard/QuickStatsCard'
import TherapyCard from '../components/dashboard/TherapyCard'
import SleepRiskCard from '../components/dashboard/SleepRiskCard'
import { useJarvisData } from '../hooks/useJarvisData'

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
}

function getWellnessLabel(score: number): string {
  if (score >= 80) return 'Optimal Range'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Moderate'
  return 'Needs Attention'
}

export default function Dashboard() {
  const { data, loading, error } = useJarvisData()
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    if (data) setLastUpdated(new Date())
  }, [data])

  const stressValue = data?.stress_level === 'High' ? 80 : data?.stress_level === 'Medium' ? 50 : 25
  const wellnessScore = data ? Math.round(data.features.productive_ratio * 100) : 0

  // FIX: Don't pass a label while data is still loading — WellnessScoreCard
  // already shows "Loading..." when score===0 and label is undefined.
  // Passing getWellnessLabel(0) = "Needs Attention" while loading was
  // showing a misleading label before the first fetch completes.
  const wellnessLabel = data ? getWellnessLabel(wellnessScore) : undefined

  return (
    <motion.div className="p-8 max-w-7xl mx-auto" variants={container} initial="hidden" animate="show"
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Good Morning, Alex
          </h1>
          <p className="text-gray-400 mt-2">
            {loading && !data
              ? 'Loading your wellness data...'
              : error
              ? 'Could not load live data. Is the backend running?'
              : 'Here is your daily wellness summary.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <motion.div
            animate={loading && data ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, repeat: loading && data ? Infinity : 0, ease: 'linear' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </motion.div>
          <span>
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
              : 'Fetching...'}
          </span>
          <span className="text-gray-600">· refreshes every 30s</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <motion.div variants={item} className="lg:col-span-2 xl:col-span-1">
          <WellnessScoreCard score={wellnessScore} label={wellnessLabel} />
        </motion.div>
        <motion.div variants={item}>
          <StressGauge level={data?.stress_level ?? 'Low'} value={stressValue} />
        </motion.div>
        <motion.div variants={item}>
          <ScreenTimeCard screenTime={data?.features.screen_time ?? null} breaks={data?.features.breaks ?? null} />
        </motion.div>
        <motion.div variants={item}>
          <SleepRiskCard nightUsage={data?.features.night_usage ?? null} />
        </motion.div>
        <motion.div variants={item} className="lg:col-span-2">
          <TherapyCard therapy={data?.therapy} message={data?.message} spotify={data?.spotify} />
        </motion.div>
        <motion.div variants={item} className="lg:col-span-2">
          <QuickStatsCard breaks={data?.features.breaks ?? null} appSwitches={data?.features.app_switches ?? null} />
        </motion.div>
      </div>
    </motion.div>
  )
}
