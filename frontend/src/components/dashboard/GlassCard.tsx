import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import type { MouseEvent, ReactNode } from 'react'

export default function GlassCard({ children, className = '' }: { children: ReactNode, className?: string }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      className={`glass rounded-2xl relative overflow-hidden group border border-white/5 hover:border-white/10 transition-colors ${className}`}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.06),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </motion.div>
  )
}
