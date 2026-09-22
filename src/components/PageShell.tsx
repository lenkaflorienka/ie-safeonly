import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { ChapterMood } from '../data/types'
import { moodStyles } from '../lib/mood'

interface PageShellProps {
  title: string
  subtitle?: string
  eyebrow?: string
  mood?: ChapterMood
  children: ReactNode
}

export function PageShell({ title, subtitle, eyebrow, mood, children }: PageShellProps) {
  const gradient = mood ? moodStyles[mood].gradient : 'from-[var(--color-cream)] via-transparent to-[var(--color-cream)]'
  const tint = mood ? moodStyles[mood].accentSoft : 'var(--color-butter)'
  return (
    <div className={`relative min-h-dvh bg-gradient-to-b ${gradient} px-4 pb-28 pt-24 sm:px-8 sm:pt-28`}>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <span
          className="animate-drift absolute -left-24 -top-24 h-[26rem] w-[26rem] rounded-full opacity-30 blur-3xl"
          style={{ background: tint }}
        />
        <span
          className="animate-drift absolute -bottom-32 -right-16 h-[30rem] w-[30rem] rounded-full opacity-20 blur-3xl"
          style={{ background: tint, animationDelay: '-6s' }}
        />
        <span
          className="animate-drift absolute right-1/4 top-1/3 h-64 w-64 rounded-full opacity-[0.12] blur-3xl"
          style={{ background: 'var(--color-sky)', animationDelay: '-11s' }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto max-w-5xl text-center"
      >
        {eyebrow && (
          <p className="mb-3 font-sans text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink-soft)]">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl text-[var(--color-ink)] sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-xl font-sans text-sm text-[var(--color-ink-soft)] sm:text-base">
            {subtitle}
          </p>
        )}
      </motion.div>

      <div className="mx-auto mt-12 max-w-5xl">{children}</div>
    </div>
  )
}
