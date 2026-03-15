import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const POLL_INTERVAL = 12000       // check every 12 seconds
const COOLDOWN_MS = 90000         // same alert won't re-fire for 90 seconds
const MAX_VISIBLE = 4             // max toasts on screen at once
const AUTO_DISMISS_MS = 8000     // auto-dismiss after 8 seconds

type AlertType = 'danger' | 'warning' | 'info' | 'success'

interface Alert {
  id: string
  type: AlertType
  title: string
  message: string
  action: string | null
  uid: string  // unique instance id for AnimatePresence
}

const TYPE_STYLES: Record<AlertType, {
  bar: string
  icon: string
  bg: string
  border: string
  title: string
}> = {
  danger: {
    bar: 'bg-red-500',
    icon: '🔴',
    bg: 'bg-[#1a0a0a]',
    border: 'border-red-500/40',
    title: 'text-red-400',
  },
  warning: {
    bar: 'bg-amber-400',
    icon: '⚠️',
    bg: 'bg-[#1a1400]',
    border: 'border-amber-400/40',
    title: 'text-amber-400',
  },
  info: {
    bar: 'bg-cyan-400',
    icon: '💡',
    bg: 'bg-[#00131a]',
    border: 'border-cyan-400/40',
    title: 'text-cyan-400',
  },
  success: {
    bar: 'bg-green-500',
    icon: '✅',
    bg: 'bg-[#001a08]',
    border: 'border-green-500/40',
    title: 'text-green-400',
  },
}

function Toast({ alert, onDismiss }: { alert: Alert; onDismiss: (uid: string) => void }) {
  const styles = TYPE_STYLES[alert.type]
  const [progress, setProgress] = useState(100)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const step = 100 / (AUTO_DISMISS_MS / 100)
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p <= 0) {
          clearInterval(intervalRef.current!)
          onDismiss(alert.uid)
          return 0
        }
        return p - step
      })
    }, 100)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.88, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`relative w-80 rounded-xl border ${styles.border} ${styles.bg} shadow-2xl overflow-hidden backdrop-blur-md`}
    >
      {/* left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${styles.bar} rounded-l-xl`} />

      {/* content */}
      <div className="pl-4 pr-3 pt-3 pb-2 ml-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm leading-tight ${styles.title}`}>
              {alert.title}
            </p>
            <p className="text-gray-300 text-xs mt-1 leading-snug">
              {alert.message}
            </p>
            {alert.action && (
              <p className="text-gray-500 text-xs mt-2 italic">
                → {alert.action}
              </p>
            )}
          </div>
          <button
            onClick={() => onDismiss(alert.uid)}
            className="text-gray-600 hover:text-gray-300 transition-colors text-lg leading-none mt-0.5 flex-shrink-0"
          >
            ×
          </button>
        </div>
      </div>

      {/* progress bar */}
      <div className="h-0.5 bg-white/5">
        <div
          className={`h-full ${styles.bar} transition-all duration-100 opacity-60`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  )
}

export default function SmartNotifications() {
  const [active, setActive] = useState<Alert[]>([])
  const cooldowns = useRef<Map<string, number>>(new Map())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const dismiss = (uid: string) => {
    setActive(prev => prev.filter(a => a.uid !== uid))
  }

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/alerts`)
      if (!res.ok) return
      const incoming: Omit<Alert, 'uid'>[] = await res.json()
      const now = Date.now()

      const fresh: Alert[] = []

      for (const alert of incoming) {
        const lastShown = cooldowns.current.get(alert.id) ?? 0
        if (now - lastShown < COOLDOWN_MS) continue  // still in cooldown

        // don't add if already visible
        const alreadyVisible = active.some(a => a.id === alert.id)
        if (alreadyVisible) continue

        cooldowns.current.set(alert.id, now)
        fresh.push({ ...alert, uid: `${alert.id}-${now}` })
      }

      if (fresh.length === 0) return

      setActive(prev => {
        const combined = [...fresh, ...prev]
        return combined.slice(0, MAX_VISIBLE)
      })
    } catch {
      // backend not ready
    }
  }

  useEffect(() => {
    fetchAlerts()
    intervalRef.current = setInterval(fetchAlerts, POLL_INTERVAL)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {active.map(alert => (
          <div key={alert.uid} className="pointer-events-auto">
            <Toast alert={alert} onDismiss={dismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}