import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import GlassCard from './GlassCard'

export default function StressGauge({ level = "Low", value = 35 }: { level?: string, value?: number }) {
  // Value 0 to 100 maps to -90 to 90 degrees
  const rotation = -90 + (value / 100) * 180

  const getGradient = (val: number) => {
    if (val < 40) return "from-[#22C55E] to-[#06B6D4]"
    if (val < 70) return "from-[#F59E0B] to-[#F97316]"
    return "from-[#EF4444] to-[#F43F5E]"
  }

  return (
    <GlassCard className="p-6 flex flex-col items-center">
      <div className="w-full flex justify-between items-start mb-6">
        <h3 className="text-gray-400 font-medium">Stress Level</h3>
        <Activity className="w-5 h-5 text-gray-500" />
      </div>
      
      <div className="relative w-48 h-24 overflow-hidden mt-4">
        {/* Background arc */}
        <div className="absolute w-48 h-48 rounded-full border-[14px] border-gray-700/40 border-b-transparent border-l-transparent -rotate-45" />
        
        {/* Colored arc representing severity regions (just decorative behind gauge) */}
        <div className="absolute w-48 h-48 rounded-full border-[14px] border-transparent border-t-[#22C55E]/30 border-r-[#EF4444]/30 rotate-45" />

        {/* Dynamic Gradient arc filling UP to the value */}
        <motion.div 
          className={`absolute w-48 h-48 rounded-full border-[14px] border-b-transparent border-l-transparent -rotate-45 opacity-90`}
          style={{ 
             borderTopColor: value < 40 ? '#22C55E' : value < 70 ? '#F59E0B' : '#EF4444',
             borderRightColor: value < 40 ? '#22C55E' : value < 70 ? '#F59E0B' : '#EF4444',
             // We'd ideally clip this or use an SVG, but using a needle is the primary indicator.
          }}
        />
        
        {/* Needle */}
        <motion.div 
          className="absolute bottom-0 left-[calc(50%-2px)] w-1 h-20 origin-bottom flex flex-col items-center justify-end pb-1"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.8, type: "spring", bounce: 0.25 }}
        >
          <div className="w-1.5 h-16 bg-white rounded-full shadow-lg" />
          <div className="absolute -bottom-2 w-4 h-4 bg-white rounded-full shadow-md z-10" />
        </motion.div>
      </div>
      
      <div className={`mt-6 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getGradient(value)}`}>
        {level}
      </div>
    </GlassCard>
  )
}
