import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMusic } from '../context/MusicContext'
import { songs } from '../data/music'

export function MusicPlayer() {
  const { current, isPlaying, isAmbientFallback, toggle, next, prev, choose } = useMusic()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[min(88vw,320px)] rounded-2xl border border-black/5 bg-[var(--color-paper)]/95 p-3 shadow-[0_20px_50px_-15px_rgba(43,36,31,0.4)] backdrop-blur"
          >
            <p className="mb-2 px-1 font-sans text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
              the soundtrack
            </p>
            <ul className="max-h-64 space-y-0.5 overflow-y-auto scrollbar-hidden">
              {songs.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => choose(s.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                      s.id === current.id
                        ? 'bg-[var(--color-cream-deep)]'
                        : 'hover:bg-[var(--color-cream-deep)]/60'
                    }`}
                  >
                    <span className="block font-display text-sm text-[var(--color-ink)]">
                      {s.title}
                    </span>
                    <span className="block font-sans text-[11px] text-[var(--color-ink-soft)]">
                      {s.artist}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {isPlaying && isAmbientFallback && (
              <p className="mt-2 border-t border-black/5 px-1 pt-2 font-sans text-[10px] leading-relaxed text-[var(--color-ink-soft)]">
                Playing an ambient placeholder for this mood — the licensed
                recording hasn't been added yet. Drop it into{' '}
                <code className="text-[9px]">/public/audio</code> to swap it in.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1 rounded-full border border-black/5 bg-[var(--color-paper)]/95 py-1.5 pl-1.5 pr-3 shadow-[0_10px_30px_-10px_rgba(43,36,31,0.35)] backdrop-blur">
        <button
          aria-label="previous song"
          onClick={prev}
          className="grid h-8 w-8 place-items-center rounded-full text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-deep)]"
        >
          <PrevIcon />
        </button>
        <button
          aria-label={isPlaying ? 'pause' : 'play'}
          onClick={toggle}
          className="relative grid h-9 w-9 place-items-center rounded-full bg-[var(--color-ink)] text-[var(--color-paper)]"
        >
          {isPlaying && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-[var(--color-clay)]/50"
              animate={{ scale: [1, 1.55, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <span className="relative">{isPlaying ? <PauseIcon /> : <PlayIcon />}</span>
        </button>
        <button
          aria-label="next song"
          onClick={next}
          className="grid h-8 w-8 place-items-center rounded-full text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-deep)]"
        >
          <NextIcon />
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          className="ml-1 flex max-w-[9.5rem] flex-col items-start leading-tight sm:max-w-[11rem]"
        >
          <span className="truncate font-display text-[13px] text-[var(--color-ink)]">
            {current.title}
          </span>
          <span className="truncate font-sans text-[10px] text-[var(--color-ink-soft)]">
            {isPlaying && isAmbientFallback ? 'ambient placeholder' : current.artist}
          </span>
        </button>
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3 1.5v13l11-6.5-11-6.5z" />
    </svg>
  )
}
function PauseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
      <rect x="3" y="2" width="3.5" height="12" />
      <rect x="9.5" y="2" width="3.5" height="12" />
    </svg>
  )
}
function PrevIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13 1.5v13L4 8l9-6.5zM3 1.5h2v13H3z" />
    </svg>
  )
}
function NextIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3 1.5v13l9-6.5-9-6.5zM11 1.5h2v13h-2z" />
    </svg>
  )
}
