import { useState, useEffect } from 'react'

const playlists: Record<string, string> = {
  Focus: "37i9dQZF1DWZeKCadgRdKQ",
  Relax: "37i9dQZF1DWZd79rJ6a7lp",
  Sleep: "37i9dQZF1DWZd79rJ6a7lp",
  "Stress relief": "37i9dQZF1DWXE8G6VdJ55N",
}

interface Props {
  initialMood?: string
}

export default function MoodPlaylistSelector({ initialMood = 'Relax' }: Props) {
  const [mood, setMood] = useState<string>(initialMood)

  // Update mood if backend recommendation loads after render
  useEffect(() => {
    setMood(initialMood)
  }, [initialMood])

  return (
    <div className="glass p-6 rounded-2xl flex flex-col h-full w-full">
      <div className="mb-6">
        <h3 className="text-white font-bold text-xl">Audio Therapy</h3>
        <p className="text-gray-400 text-sm mt-1">Select a mood to update the playlist</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(playlists).map(m => (
          <button
            key={m}
            onClick={() => setMood(m)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mood === m ? 'bg-[#4F46E5] text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'}`}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="grow w-full bg-black/50 rounded-xl overflow-hidden shadow-2xl">
        <iframe
          style={{ borderRadius: '12px' }}
          src={`https://open.spotify.com/embed/playlist/${playlists[mood]}?utm_source=generator&theme=0`}
          width="100%" height="352" frameBorder="0" allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  )
}