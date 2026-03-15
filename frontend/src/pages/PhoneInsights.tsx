import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Smartphone, Sparkles, CheckCircle, AlertCircle, Clock, BarChart3, Brain, X } from 'lucide-react'
import GlassCard from '../components/dashboard/GlassCard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
} as const

const item = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
} as const

interface AppEntry {
  name: string
  time: string
  minutes: number
  category: string
}

interface AnalysisResult {
  summary: string
  total_screen_time: string
  apps: AppEntry[]
  recommendations: string[]
  wellness_score: number
  dominant_category: string
}

const CATEGORY_COLORS: Record<string, string> = {
  Social: '#A855F7',
  Entertainment: '#EF4444',
  Productivity: '#22C55E',
  Communication: '#3B82F6',
  Health: '#10B981',
  Gaming: '#F59E0B',
  Education: '#06B6D4',
  Other: '#6B7280',
}

function CategoryBadge({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {category}
    </span>
  )
}

export default function PhoneInsights() {
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, etc.)')
      return
    }
    setError(null)
    setResult(null)
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleAnalyze = async () => {
    if (!fileRef.current?.files?.[0] && !preview) return
    const input = fileRef.current
    const file = input?.files?.[0]
    if (!file) { setError('No file selected'); return }

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch(`${API_URL}/api/analyze-screenshot`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Make sure your Gemini API key is set.')
    } finally {
      setLoading(false)
    }
  }

  const clearAll = () => {
    setPreview(null)
    setFileName(null)
    setResult(null)
    setError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <motion.div
      className="p-8 max-w-7xl mx-auto"
      variants={container} initial="hidden" animate="show"
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
    >
      {/* Header */}
      <motion.div variants={item} className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#A855F7] to-[#06B6D4]">
          Phone Insights
        </h1>
        <p className="text-gray-400 mt-2">
          Upload your Digital Wellbeing screenshot for an AI-powered analysis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div variants={item} className="space-y-4">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !preview && fileRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
              ${dragOver ? 'border-[#A855F7] bg-[#A855F7]/10' : preview ? 'border-white/10 cursor-default' : 'border-white/20 hover:border-[#A855F7]/60 hover:bg-[#A855F7]/5'}
            `}
            style={{ minHeight: '320px' }}
          >
            {preview ? (
              <div className="relative w-full h-full flex items-center justify-center p-4" style={{ minHeight: '320px' }}>
                <img src={preview} alt="Preview" className="max-h-72 max-w-full rounded-xl object-contain shadow-2xl" />
                <button
                  onClick={(e) => { e.stopPropagation(); clearAll() }}
                  className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-red-500/80 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                {fileName && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-xs text-gray-300 px-3 py-1 rounded-full backdrop-blur">
                    {fileName}
                  </div>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className={`p-5 rounded-2xl transition-colors ${dragOver ? 'bg-[#A855F7]/20' : 'bg-white/5'}`}>
                  <Upload className={`w-10 h-10 transition-colors ${dragOver ? 'text-[#A855F7]' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Drop your screenshot here</p>
                  <p className="text-gray-400 text-sm mt-1">or click to browse files</p>
                  <p className="text-gray-600 text-xs mt-3">Supports PNG, JPG, WebP — any phone's Digital Wellbeing screen</p>
                </div>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          {/* Analyze Button */}
          <motion.button
            onClick={handleAnalyze}
            disabled={!preview || loading}
            whileHover={preview && !loading ? { scale: 1.02 } : {}}
            whileTap={preview && !loading ? { scale: 0.98 } : {}}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300
              ${preview && !loading
                ? 'bg-gradient-to-r from-[#A855F7] to-[#06B6D4] text-white shadow-lg shadow-[#A855F7]/20 hover:shadow-[#A855F7]/40'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Analysing with Gemini AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyse Screenshot
              </>
            )}
          </motion.button>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Panel */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center gap-4 py-20 text-gray-600"
              >
                <Smartphone className="w-14 h-14 opacity-30" />
                <p className="text-sm">Your analysis will appear here after you upload a screenshot.</p>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="results"
                variants={container} initial="hidden" animate="show"
                className="space-y-4"
              >
                {/* Summary Card */}
                <motion.div variants={item}>
                  <GlassCard className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#A855F7]/10 rounded-xl shrink-0">
                        <Brain className="w-6 h-6 text-[#A855F7]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-white text-lg">AI Summary</h3>
                          <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Analysed
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{result.summary}</p>
                        <div className="flex flex-wrap gap-4 mt-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4 text-[#06B6D4]" />
                            Total: <span className="text-white font-semibold">{result.total_screen_time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <BarChart3 className="w-4 h-4 text-[#A855F7]" />
                            Top category: <span className="text-white font-semibold">{result.dominant_category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Wellness Score */}
                <motion.div variants={item}>
                  <GlassCard className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">Phone Wellness Score</h3>
                      <span className="text-2xl font-bold" style={{
                        color: result.wellness_score >= 70 ? '#22C55E' : result.wellness_score >= 40 ? '#F59E0B' : '#EF4444'
                      }}>{result.wellness_score}/100</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.wellness_score}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{
                          background: result.wellness_score >= 70
                            ? 'linear-gradient(to right, #22C55E, #10B981)'
                            : result.wellness_score >= 40
                            ? 'linear-gradient(to right, #F59E0B, #EF4444)'
                            : 'linear-gradient(to right, #EF4444, #DC2626)'
                        }}
                      />
                    </div>
                  </GlassCard>
                </motion.div>

                {/* App Breakdown */}
                {result.apps.length > 0 && (
                  <motion.div variants={item}>
                    <GlassCard className="p-5">
                      <h3 className="font-semibold text-white mb-4">App Breakdown</h3>
                      <div className="space-y-3">
                        {result.apps.map((app, i) => {
                          const maxMinutes = Math.max(...result.apps.map(a => a.minutes))
                          const pct = maxMinutes > 0 ? (app.minutes / maxMinutes) * 100 : 0
                          const color = CATEGORY_COLORS[app.category] || CATEGORY_COLORS.Other
                          return (
                            <div key={i}>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium">{app.name}</span>
                                  <CategoryBadge category={app.category} />
                                </div>
                                <span className="text-gray-400 font-mono text-xs">{app.time}</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                {/* Recommendations */}
                {result.recommendations.length > 0 && (
                  <motion.div variants={item}>
                    <GlassCard className="p-5">
                      <h3 className="font-semibold text-white mb-4">AI Recommendations</h3>
                      <div className="space-y-3">
                        {result.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                            <div className="w-6 h-6 rounded-full bg-[#A855F7]/20 text-[#A855F7] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
