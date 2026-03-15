import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import SmartNotifications from './components/notifications/SmartNotifications'

import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Therapy from './pages/Therapy'
import Settings from './pages/Settings'
import PhoneInsights from './pages/PhoneInsights'
import Insights from './pages/Insights'

function App() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-[#0F172A] text-white overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/therapy" element={<Therapy />} />
            <Route path="/phone-insights" element={<PhoneInsights />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AnimatePresence>
      </main>
      <SmartNotifications />
    </div>
  )
}

export default App