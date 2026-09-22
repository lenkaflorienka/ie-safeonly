import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Place } from '../data/types'
import { toneClasses } from '../lib/mood'

interface FlashbackPayload {
  place: Place
  dateLabel?: string
}

interface FlashbackContextValue {
  trigger: (payload: FlashbackPayload) => void
}

const FlashbackContext = createContext<FlashbackContextValue | null>(null)

export function FlashbackProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<FlashbackPayload | null>(null)

  const trigger = useCallback((payload: FlashbackPayload) => {
    setActive(payload)
  }, [])

  const value = useMemo(() => ({ trigger }), [trigger])

  return (
    <FlashbackContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-label={`Flashback: ${active.place.name}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--color-ink)]/70 backdrop-blur-sm p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="grain relative w-full max-w-md overflow-hidden rounded-lg bg-[var(--color-paper)] shadow-2xl"
            >
              <div
                className={`relative flex aspect-[4/3] items-end bg-gradient-to-br p-5 ${toneClasses[active.place.photo.tone]}`}
              >
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_20px_rgba(43,36,31,0.35)]" />
                <span className="relative font-sans text-[11px] uppercase tracking-[0.16em] text-black/55">
                  {active.place.photo.label}
                </span>
              </div>
              <div className="p-5">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                  a memory resurfaces {active.dateLabel ? `— ${active.dateLabel}` : ''}
                </p>
                <h3 className="mt-1 font-display text-xl text-[var(--color-ink)]">
                  {active.place.name}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-[var(--color-ink-soft)]">
                  {active.place.memory ?? '[ADD MEMORY HERE]'}
                </p>
                <button
                  onClick={() => setActive(null)}
                  className="mt-4 font-sans text-xs uppercase tracking-[0.14em] text-[var(--color-clay)]"
                >
                  back to now →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </FlashbackContext.Provider>
  )
}

export function useFlashback() {
  const ctx = useContext(FlashbackContext)
  if (!ctx) throw new Error('useFlashback must be used within FlashbackProvider')
  return ctx
}
