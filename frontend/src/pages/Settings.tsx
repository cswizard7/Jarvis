import { motion, type Variants } from 'framer-motion'
import { Bell, Target, Database, Music } from 'lucide-react'
import { useState } from 'react'

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

// FIX: Added "as const" to transition.type so TypeScript narrows it from
// string -> "spring" literal, satisfying Framer Motion's Variants type.
const item: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
}

function Toggle({ checked, onChange }: { checked: boolean, onChange: () => void }) {
  return (
    <div 
      onClick={onChange}
      className={`relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${checked ? 'bg-[#22C55E]' : 'bg-gray-600'}`}
    >
      <motion.div 
        className="bg-white w-4 h-4 rounded-full shadow-md"
        layout
        transition={{ type: "spring" as const, stiffness: 500, damping: 30 }}
        style={{ x: checked ? 24 : 0 }}
      />
    </div>
  )
}

export default function Settings() {
  const [notifications, setNotifications] = useState({
    dailySummary: true,
    screenTimeAlerts: true,
    therapyReminders: false
  });

  const [spotifyConnected, setSpotifyConnected] = useState(true);

  return (
    <motion.div 
      className="p-8 max-w-4xl mx-auto h-full"
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#06B6D4] to-[#4F46E5]">
          Settings
        </h1>
        <p className="text-gray-400 mt-2">Manage your goals, notifications, and data.</p>
      </div>

      <div className="space-y-6 pb-12">
        {/* Goals Section */}
        <motion.div variants={item} className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#06B6D4]/10 rounded-lg">
              <Target className="w-5 h-5 text-[#06B6D4]" />
            </div>
            <h2 className="text-xl font-bold">Wellness Goals</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Daily Screen Time Limit (Hours)</label>
              <input type="range" min="1" max="12" defaultValue="5" className="w-full accent-[#06B6D4] bg-gray-700 h-2 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1h</span><span>12h</span>
              </div>
            </div>
            <div>
               <label className="text-sm text-gray-400 block mb-2">Target Bedtime</label>
               <input type="time" defaultValue="22:30" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#06B6D4] transition-colors" />
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div variants={item} className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#F59E0B]/10 rounded-lg">
              <Bell className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div>
                <h4 className="font-medium text-white mb-1">Daily Summary</h4>
                <p className="text-sm text-gray-400">Receive morning insights on yesterday's usage.</p>
              </div>
              <Toggle checked={notifications.dailySummary} onChange={() => setNotifications(p => ({ ...p, dailySummary: !p.dailySummary }))} />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div>
                <h4 className="font-medium text-white mb-1">Screen Time Alerts</h4>
                <p className="text-sm text-gray-400">Get notified when approaching your daily limit.</p>
              </div>
              <Toggle checked={notifications.screenTimeAlerts} onChange={() => setNotifications(p => ({ ...p, screenTimeAlerts: !p.screenTimeAlerts }))} />
            </div>
          </div>
        </motion.div>

        {/* Integrations */}
        <motion.div variants={item} className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#22C55E]/10 rounded-lg">
              <Music className="w-5 h-5 text-[#22C55E]" />
            </div>
            <h2 className="text-xl font-bold">Integrations</h2>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center">
                 <Music className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <div>
                <h4 className="font-medium text-white">Spotify</h4>
                <p className="text-sm text-gray-400">{spotifyConnected ? 'Connected as Alex' : 'Not Connected'}</p>
              </div>
            </div>
            <button 
              onClick={() => setSpotifyConnected(!spotifyConnected)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${spotifyConnected ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-[#1DB954] hover:bg-[#1ed760] text-black'}`}
            >
              {spotifyConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </motion.div>

        {/* Data Privacy */}
        <motion.div variants={item} className="glass p-6 rounded-2xl border border-red-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Database className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-xl font-bold">Data & Privacy</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors">
              Export My Data
            </button>
            <button className="flex-1 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-transparent hover:border-red-500/30 rounded-xl font-medium transition-colors">
              Delete Account
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
