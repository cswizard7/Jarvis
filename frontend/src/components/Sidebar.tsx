import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BarChart2, HeartHandshake, Settings, Activity, Smartphone, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/therapy', label: 'Therapy', icon: HeartHandshake },
  { path: '/phone-insights', label: 'Phone Insights', icon: Smartphone },
  { path: '/insights', label: 'Jarvis Chat', icon: Sparkles },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-full glass flex flex-col pt-8 pb-4 border-r border-white/10 z-50"
    >
      <div className="flex items-center gap-3 px-6 mb-12">
        <div className="p-2 bg-[#4F46E5]/20 rounded-xl">
          <Activity className="w-6 h-6 text-[#4F46E5]" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Jarvis</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group",
              isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-[#4F46E5]/20 border border-[#4F46E5]/30 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5 relative z-10 transition-colors", isActive ? "text-[#4F46E5]" : "group-hover:text-[#4F46E5]")} />
                <span className="font-medium relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="px-6 mt-auto">
        <div className="text-xs text-gray-500 font-medium">Digital Wellness AI v1.0</div>
      </div>
    </motion.aside>
  )
}