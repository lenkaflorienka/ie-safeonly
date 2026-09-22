import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { chapters } from '../data/locations'
import { smoothPath } from '../lib/path'
import { moodStyles } from '../lib/mood'
import { PageShell } from '../components/PageShell'

export function Hub() {
  const navigate = useNavigate()
  const pathD = useMemo(() => smoothPath(chapters.map((c) => c.coordinates)), [])

  return (
    <PageShell title="the map" subtitle="every place holds a memory — tap one to open it">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-3xl sm:aspect-[16/10]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <motion.path
            d={pathD}
            fill="none"
            stroke="var(--color-clay)"
            strokeWidth="0.35"
            strokeDasharray="1.2 1.4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.55 }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
          />
        </svg>

        {chapters.map((chapter, i) => {
          const style = moodStyles[chapter.mood]
          return (
            <motion.button
              key={chapter.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              onClick={() => navigate(`/chapter/${chapter.id}`)}
              style={{ left: `${chapter.coordinates.x}%`, top: `${chapter.coordinates.y}%` }}
              className="group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
            >
              <span
                className="block h-4 w-4 rounded-full shadow-[0_2px_8px_rgba(43,36,31,0.45)] ring-2 ring-[var(--color-paper)] transition-transform group-hover:scale-125 sm:h-[18px] sm:w-[18px]"
                style={{ background: style.accent }}
              />
              <span className="pointer-events-none absolute left-1/2 top-full mt-2 w-max -translate-x-1/2 rounded-full bg-[var(--color-ink)] px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.12em] text-[var(--color-paper)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {chapter.chapterLabel}
              </span>
              <span className="mt-2 block text-center font-display text-[11px] text-[var(--color-ink-soft)] sm:text-xs">
                {chapter.chapterLabel}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-3 text-center">
        <button
          onClick={() => navigate('/replay')}
          className="rounded-full bg-[var(--color-ink)] px-6 py-3 font-sans text-xs uppercase tracking-[0.16em] text-[var(--color-paper)]"
        >
          replay the journey, start to finish
        </button>
        <button
          onClick={() => navigate('/people')}
          className="rounded-full border border-[var(--color-ink)]/20 px-6 py-3 font-sans text-xs uppercase tracking-[0.16em] text-[var(--color-ink)]"
        >
          the twelve of us
        </button>
      </div>
    </PageShell>
  )
}
