import { motion, useAnimationControls } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Play, Square } from 'lucide-react'
import GlassCard from '../dashboard/GlassCard'

export default function BreathingAnimation() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState('Ready')
  const controls = useAnimationControls()
  const activeRef = useRef(isActive);
  activeRef.current = isActive;

  useEffect(() => {
    let timeoutId: number;
    
    const runCycle = async () => {
      if (!activeRef.current) return;
      
      // Inhale (4s)
      setPhase('Inhale')
      await controls.start({
        scale: 2.2,
        backgroundColor: "rgba(34, 197, 94, 0.5)", // green/primary
        borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
        transition: { duration: 4, ease: "easeInOut" }
      })
      
      if (!activeRef.current) return;
      
      // Hold (4s)
      setPhase('Hold')
      await controls.start({
        scale: 2.2,
        backgroundColor: "rgba(34, 197, 94, 0.7)",
        borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        transition: { duration: 4, ease: "linear" }
      })
      
      if (!activeRef.current) return;
      
      // Exhale (6s)
      setPhase('Exhale')
      await controls.start({
        scale: 1,
        backgroundColor: "rgba(6, 182, 212, 0.3)",
        borderRadius: "50% 50% 50% 50% / 50% 50% 50% 50%",
        transition: { duration: 6, ease: "easeInOut" }
      })
      
      if (activeRef.current) {
        timeoutId = window.setTimeout(runCycle, 100);
      }
    }

    if (isActive) {
      runCycle()
    } else {
      setPhase('Ready')
      controls.stop()
      controls.set({ scale: 1, backgroundColor: "rgba(6, 182, 212, 0.3)", borderRadius: "50%" })
    }
    
    return () => {
      if(timeoutId) clearTimeout(timeoutId);
    }
  }, [isActive, controls])

  return (
    <GlassCard className="p-8 flex flex-col items-center justify-center h-full w-full">
       <h3 className="text-white font-bold text-xl mb-2 self-start absolute top-6 left-6 z-10">4-4-6 Breathing</h3>
       <p className="text-gray-400 text-sm mb-12 self-start absolute top-14 left-6 z-10">Lower stress and re-center</p>
       
       <div className="relative w-64 h-64 flex items-center justify-center my-12">
          {isActive && (
            <motion.div 
              className="absolute inset-0 rounded-full bg-[#22C55E]/10 blur-2xl"
              animate={{ scale: [1, 2, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            />
          )}
          
          <motion.div 
            animate={controls}
            className="w-24 h-24 border border-white/30 flex items-center justify-center backdrop-blur-md z-10 shadow-2xl"
            style={{ backgroundColor: "rgba(6, 182, 212, 0.3)" }}
            initial={{ scale: 1, borderRadius: "50%" }}
          >
            <span className="font-semibold text-white tracking-widest text-sm">{phase}</span>
          </motion.div>
       </div>
       
       <button 
         onClick={() => setIsActive(!isActive)}
         className={`mt-4 z-10 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${isActive ? 'bg-white/10 text-white hover:bg-white/20 hover:scale-105' : 'bg-[#22C55E] text-white hover:bg-[#16a34a] shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105'}`}
       >
         {isActive ? (
             <><Square className="w-5 h-5 fill-current" /> Stop Session</>
         ) : (
             <><Play className="w-5 h-5 fill-current" /> Start Exercise</>
         )}
       </button>
    </GlassCard>
  )
}
