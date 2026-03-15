import { motion, type Variants } from 'framer-motion'
import ScreenTimeLineChart from '../components/charts/ScreenTimeLineChart'
import CategoryBarChart from '../components/charts/CategoryBarChart'
import StressScatterPlot from '../components/charts/StressScatterPlot'
import HourlyHeatmap from '../components/charts/HourlyHeatmap'

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

// FIX: Added "as const" to transition.type so TypeScript narrows it from
// string -> "spring" literal, satisfying Framer Motion's Variants type.
const item: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
}

export default function Analytics() {
  return (
    <motion.div 
      className="p-8 max-w-7xl mx-auto h-full flex flex-col"
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
    >
      <div className="mb-8 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Analytics Overview
          </h1>
          <p className="text-gray-400 mt-2">Understand your digital habits and wellness correlations.</p>
        </div>
        <button className="px-4 py-2 bg-[#4F46E5]/20 text-[#4F46E5] hover:text-white rounded-xl font-medium hover:bg-[#4F46E5] transition-colors border border-[#4F46E5]/30">
          Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-8">
        <motion.div variants={item} className="h-[420px]">
          <ScreenTimeLineChart />
        </motion.div>
        
        <motion.div variants={item} className="h-[420px]">
          <CategoryBarChart />
        </motion.div>

        <motion.div variants={item} className="h-[420px]">
          <StressScatterPlot />
        </motion.div>

        <motion.div variants={item} className="h-[420px]">
          <HourlyHeatmap />
        </motion.div>
      </div>
    </motion.div>
  )
}
