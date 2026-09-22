import { useState, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const STAMPS = [
  { code: 'CGK', city: 'Jakarta' },
  { code: 'IST', city: 'Istanbul' },
  { code: 'MST', city: 'Maastricht' },
]

export function Opening() {
  const navigate = useNavigate()
  const [stage, setStage] = useState<0 | 1 | 2>(0)
  const prefersReducedMotion = useReducedMotion()

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const tiltX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), {
    stiffness: 160,
    damping: 18,
  })
  const tiltY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 160,
    damping: 18,
  })

  function handlePassPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function handlePassPointerLeave() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[var(--color-cream)] px-6 py-16 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="animate-drift absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[var(--color-sky)] opacity-40 blur-3xl" />
        <span
          className="animate-drift absolute -bottom-24 -right-16 h-[28rem] w-[28rem] rounded-full bg-[var(--color-blush)] opacity-40 blur-3xl"
          style={{ animationDelay: '-7s' }}
        />
        <span
          className="animate-drift absolute right-10 top-10 h-72 w-72 rounded-full bg-[var(--color-butter)] opacity-30 blur-3xl"
          style={{ animationDelay: '-13s' }}
        />
      </div>

      {stage === 0 && (
        <motion.button
          key="cta0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setStage(1)}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[var(--color-ink-soft)]">
            Djarum Foundation &middot; International Exposure &middot; Batch 40
          </span>
          <span className="font-display text-4xl leading-tight text-[var(--color-ink)] sm:text-5xl">
            eleven days in may
          </span>
          <span className="font-sans text-sm text-[var(--color-ink-soft)]">
            press to open the boarding pass
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-2 text-2xl text-[var(--color-clay)]"
            aria-hidden
          >
            ↓
          </motion.span>
        </motion.button>
      )}

      {stage === 1 && (
        <motion.div
          key="pass"
          initial={{ opacity: 0, y: 30, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          onPointerMove={handlePassPointerMove}
          onPointerLeave={handlePassPointerLeave}
          style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}
          className="relative z-10 w-full max-w-md rounded-lg border border-black/10 bg-[var(--color-paper)] p-6 text-left shadow-[0_30px_70px_-20px_rgba(43,36,31,0.45)] sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between border-b border-dashed border-black/15 pb-4">
            <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-[var(--color-ink-soft)]">
              Boarding Pass
            </span>
            <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-[var(--color-ink-soft)]">
              Turkish Airlines
            </span>
          </div>

          <div className="mb-6 flex items-center justify-between">
            {STAMPS.map((s, i) => (
              <div key={s.code} className="flex items-center gap-3">
                <div className="text-left">
                  <p className="font-display text-2xl text-[var(--color-ink)]">{s.code}</p>
                  <p className="font-sans text-[10px] uppercase tracking-wide text-[var(--color-ink-soft)]">
                    {s.city}
                  </p>
                </div>
                {i < STAMPS.length - 1 && (
                  <span className="text-[var(--color-clay)]" aria-hidden>
                    ✈
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-dashed border-black/15 pt-4 font-sans text-xs">
            <div>
              <p className="uppercase tracking-wide text-[var(--color-ink-soft)]">Passenger</p>
              <p className="mt-1 font-display text-base text-[var(--color-ink)]">
                Beswan Djarum &middot; Batch 40
              </p>
            </div>
            <div>
              <p className="uppercase tracking-wide text-[var(--color-ink-soft)]">Delegation</p>
              <p className="mt-1 font-display text-base text-[var(--color-ink)]">12 travelers</p>
            </div>
            <div>
              <p className="uppercase tracking-wide text-[var(--color-ink-soft)]">Departed</p>
              <p className="mt-1 font-display text-base text-[var(--color-ink)]">May 2026</p>
            </div>
            <div>
              <p className="uppercase tracking-wide text-[var(--color-ink-soft)]">Destination</p>
              <p className="mt-1 font-display text-base text-[var(--color-ink)]">EuroMUN 2026</p>
            </div>
          </div>

          <button
            onClick={() => setStage(2)}
            className="mt-8 w-full rounded-full bg-[var(--color-ink)] py-3 font-sans text-xs uppercase tracking-[0.18em] text-[var(--color-paper)] transition-transform hover:scale-[1.02]"
          >
            begin the memory
          </button>
        </motion.div>
      )}

      {stage === 2 && (
        <motion.div
          key="final"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex max-w-lg flex-col items-center gap-6"
        >
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-ink-soft)]">
            six months of weekends. eleven days in Europe. twelve people.
          </p>
          <h1 className="font-display text-3xl leading-snug text-[var(--color-ink)] sm:text-4xl">
            This is where we come back to remember it.
          </h1>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/map')}
            className="mt-4 rounded-full border border-[var(--color-ink)]/20 bg-[var(--color-ink)] px-8 py-3 font-sans text-xs uppercase tracking-[0.18em] text-[var(--color-paper)]"
          >
            enter
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}
