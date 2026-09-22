import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { chapters } from '../data/locations'
import { PageShell } from '../components/PageShell'
import { PlaceCard } from '../components/PlaceCard'
import { useMusic } from '../context/MusicContext'

export function Replay() {
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const { suggestMood } = useMusic()
  const chapter = chapters[index]

  useEffect(() => {
    if (started) suggestMood(chapter.mood)
  }, [started, chapter, suggestMood])

  if (!started) {
    return (
      <PageShell eyebrow="replay" title="Start to finish">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md rounded-2xl border border-black/5 bg-[var(--color-paper)]/70 p-8 text-center"
        >
          <p className="font-display text-lg leading-relaxed text-[var(--color-ink)]">
            Six months of weekends. A flight. Four cities. One competition. The way home.
          </p>
          <p className="mt-3 font-sans text-sm text-[var(--color-ink-soft)]">
            This walks through it in order — the way it actually happened, one chapter at a
            time.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="mt-6 rounded-full bg-[var(--color-ink)] px-7 py-3 font-sans text-xs uppercase tracking-[0.16em] text-[var(--color-paper)]"
          >
            begin
          </button>
        </motion.div>
      </PageShell>
    )
  }

  return (
    <PageShell
      eyebrow={`${index + 1} of ${chapters.length} · ${chapter.chapterLabel} · ${chapter.dateLabel}`}
      title={chapter.name}
      subtitle={chapter.blurb}
      mood={chapter.mood}
    >
      <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {chapter.places.map((place, i) => (
          <PlaceCard key={place.id} place={place} index={i} dateLabel={chapter.dateLabel} />
        ))}
      </div>

      <div className="mt-14 flex items-center justify-center gap-3">
        <button
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="rounded-full border border-[var(--color-ink)]/20 px-5 py-2.5 font-sans text-xs uppercase tracking-[0.14em] text-[var(--color-ink)] disabled:opacity-30"
        >
          {'←'} before
        </button>
        <button
          onClick={() => {
            if (index === chapters.length - 1) navigate('/ending')
            else setIndex((i) => i + 1)
          }}
          className="rounded-full bg-[var(--color-ink)] px-6 py-2.5 font-sans text-xs uppercase tracking-[0.14em] text-[var(--color-paper)]"
        >
          {index === chapters.length - 1 ? 'continue the journey' : `next: ${chapters[index + 1].chapterLabel} →`}
        </button>
      </div>
    </PageShell>
  )
}
