import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Place } from '../data/types'
import { Photo } from './Photo'
import { useFlashback } from '../context/FlashbackContext'

const ROTATIONS = [-2.5, 1.5, -1, 2, -1.8, 1.2]

export function PlaceCard({ place, index, dateLabel }: { place: Place; index: number; dateLabel?: string }) {
  const [factOpen, setFactOpen] = useState(false)
  const [littleOpen, setLittleOpen] = useState(false)
  const { trigger } = useFlashback()
  const isPolaroid = place.photo.shape === 'polaroid'
  const rotate = isPolaroid ? ROTATIONS[index % ROTATIONS.length] : 0
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.06 }}
      className="relative rounded-2xl border border-black/5 bg-[var(--color-paper)]/70 p-4 shadow-[0_10px_35px_-18px_rgba(43,36,31,0.4)]"
    >
      {place.isHidden && (
        <button
          aria-label="reveal a hidden memory"
          onClick={() => trigger({ place, dateLabel })}
          className="absolute -right-2 -top-2 z-10 grid h-8 w-8 animate-pulse place-items-center rounded-full bg-[var(--color-clay)] text-[var(--color-paper)] shadow-lg"
          title="you had to be there"
        >
          <span className="font-display text-sm">?</span>
        </button>
      )}

      <Photo
        photo={place.photo}
        rotate={rotate}
        className="mb-4"
        animate={false}
        src={place.photo.hasRealImage ? `/photos/${place.id}.jpg` : undefined}
      />

      <h3 className="font-display text-lg text-[var(--color-ink)]">{place.name}</h3>
      {place.subtitle && (
        <p className="mt-0.5 font-sans text-[13px] italic text-[var(--color-ink-soft)]">
          {place.subtitle}
        </p>
      )}

      <div className="mt-3 rounded-lg bg-[var(--color-cream-deep)]/60 p-3">
        <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
          our memory
        </p>
        <p className="mt-1 font-display text-[15px] leading-relaxed text-[var(--color-ink)]">
          {place.memory ?? '[ADD MEMORY HERE]'}
        </p>
      </div>

      {place.quote && (
        <blockquote className="mt-3 border-l-2 border-[var(--color-clay)]/50 pl-3 font-display text-sm italic text-[var(--color-ink-soft)]">
          “{place.quote}”
        </blockquote>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {place.fact && (
          <button
            onClick={() => setFactOpen((v) => !v)}
            className="rounded-full border border-black/10 px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-soft)] hover:border-black/20"
          >
            did you know? {factOpen ? '−' : '+'}
          </button>
        )}
        {place.littleThing && (
          <button
            onClick={() => setLittleOpen((v) => !v)}
            className="rounded-full border border-black/10 px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-soft)] hover:border-black/20"
          >
            the little thing {littleOpen ? '−' : '+'}
          </button>
        )}
      </div>

      {factOpen && place.fact && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 font-sans text-[13px] leading-relaxed text-[var(--color-ink-soft)]"
        >
          {place.fact}
        </motion.p>
      )}
      {littleOpen && place.littleThing && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 font-sans text-[13px] italic leading-relaxed text-[var(--color-ink-soft)]"
        >
          {place.littleThing}
        </motion.p>
      )}
    </motion.article>
  )
}
