import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { people } from '../data/people'
import { placeById } from '../data/locations'
import { PageShell } from '../components/PageShell'
import type { Person } from '../data/types'

const PALETTE = ['#a9d3e8', '#cbb9e0', '#f2b8bd', '#f6d372', '#8fae82', '#ef8354']

export function PeopleView() {
  const [active, setActive] = useState<Person | null>(null)

  return (
    <PageShell
      eyebrow="not a team page"
      title="Twelve of us"
      subtitle="Ten delegates. Two Faculty Advisors. One delegation. This isn’t a staff directory — it’s who was there."
    >
      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 sm:grid-cols-4 sm:gap-6">
        {people.map((person, i) => (
          <motion.button
            key={person.id}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
            onClick={() => setActive(person)}
            className="group flex flex-col items-center gap-2"
          >
            <span
              className="grid aspect-square w-full place-items-center rounded-full text-2xl font-display text-[var(--color-ink)]/70 shadow-inner transition-transform group-hover:scale-105"
              style={{ background: `${PALETTE[i % PALETTE.length]}55` }}
            >
              {person.isPlaceholderName ? '?' : person.name.charAt(0)}
            </span>
            <span className="text-center font-sans text-[11px] leading-tight text-[var(--color-ink-soft)]">
              {person.name}
              {person.isCoach && <span className="block text-[9px] uppercase tracking-wide">coach</span>}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/60 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-[var(--color-paper)] p-6 text-center shadow-2xl"
            >
              <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[var(--color-cream-deep)] font-display text-2xl text-[var(--color-ink)]">
                {active.isPlaceholderName ? '?' : active.name.charAt(0)}
              </span>
              <h3 className="font-display text-xl text-[var(--color-ink)]">{active.name}</h3>
              <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
                {active.role === 'advisor' ? 'Faculty Advisor' : 'Delegate'}
                {active.isCoach ? ' · Coach' : ''}
              </p>
              {active.blurb && (
                <p className="mt-4 font-display text-[15px] leading-relaxed text-[var(--color-ink)]">
                  {active.blurb}
                </p>
              )}
              {active.quote && (
                <blockquote className="mt-3 border-l-2 border-[var(--color-clay)]/50 pl-3 text-left font-display text-sm italic text-[var(--color-ink-soft)]">
                  “{active.quote}”
                </blockquote>
              )}
              {active.placeIds && active.placeIds.length > 0 && (
                <p className="mt-4 font-sans text-[11px] text-[var(--color-ink-soft)]">
                  appears in: {active.placeIds.map((pid) => placeById(pid)?.name).filter(Boolean).join(', ')}
                </p>
              )}
              <button
                onClick={() => setActive(null)}
                className="mt-5 rounded-full border border-black/10 px-5 py-2 font-sans text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-soft)]"
              >
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}
