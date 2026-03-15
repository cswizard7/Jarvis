import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const QUICK_PROMPTS = [
  "How was my day?",
  "Am I burning out?",
  "What should I fix tomorrow?",
  "How's my focus today?",
  "Should I stop working now?",
]

interface Message {
  role: 'user' | 'jarvis'
  text: string
  id: number
}

export default function Insights() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('jarvis_chat_history')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        // ignore parse error and fallback to default
      }
    }
    return [
      {
        role: 'jarvis',
        text: "Hey, I'm Jarvis. Ask me anything about your day — screen time, stress, focus, whatever's on your mind.",
        id: 0
      }
    ]
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(1)

  useEffect(() => {
    localStorage.setItem('jarvis_chat_history', JSON.stringify(messages))
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text: string) => {
    if (!text.trim() || loading) return

    const newId = Date.now() // use timestamp for unique IDs
    const userMsg: Message = { role: 'user', text, id: newId }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })
      const data = await res.json()

      const jarvisMsg: Message = {
        role: 'jarvis',
        text: data.reply || data.error || 'Something went wrong.',
        id: Date.now() + 1
      }
      setMessages(prev => [...prev, jarvisMsg])
    } catch {
      setMessages(prev => [...prev, {
        role: 'jarvis',
        text: 'Could not reach the backend. Make sure app.py is running.',
        id: Date.now() + 1
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full w-full px-6 py-6 max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Jarvis Chat</h1>
        <p className="text-gray-400 text-sm mt-1">
          Your personal AI wellness debrief — powered by your actual data
        </p>
      </div>

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'jarvis' && (
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold mr-2 mt-1 flex-shrink-0">
                  J
                </div>
              )}
              <div
                className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold mr-2 mt-1 flex-shrink-0">
              J
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gray-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts — show until conversation gets going */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {QUICK_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => send(p)}
              className="text-xs text-gray-400 border border-white/10 hover:border-indigo-500 hover:text-indigo-400 px-3 py-1.5 rounded-full transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          disabled={loading}
          placeholder="Ask Jarvis anything about your day..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors disabled:opacity-40"
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl transition-colors font-medium text-sm"
        >
          Send
        </button>
      </div>
    </motion.div>
  )
}
