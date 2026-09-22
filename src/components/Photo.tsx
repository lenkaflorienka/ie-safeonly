import { motion, useReducedMotion } from 'framer-motion'
import type { PhotoPlaceholder } from '../data/types'
import { toneClasses } from '../lib/mood'

interface PhotoProps {
  photo: PhotoPlaceholder
  className?: string
  rotate?: number
  /** src for a real image once available, e.g. `/photos/${id}.jpg` */
  src?: string
  /** Set false when a parent element already animates this photo into view. */
  animate?: boolean
}

const shapeClasses: Record<NonNullable<PhotoPlaceholder['shape']>, string> = {
  polaroid: 'aspect-[4/5]',
  strip: 'aspect-[3/4]',
  full: 'aspect-[4/3]',
  wide: 'aspect-[16/10]',
  tall: 'aspect-[3/4]',
}

export function Photo({ photo, className = '', rotate = 0, src, animate = true }: PhotoProps) {
  const shape = photo.shape ?? 'full'
  const prefersReducedMotion = useReducedMotion()
  const shouldAnimate = animate && !prefersReducedMotion
  return (
    <motion.figure
      initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ rotate: `${rotate}deg` }}
      className={`group relative overflow-hidden rounded-sm shadow-[0_8px_30px_-10px_rgba(43,36,31,0.35)] ${shapeClasses[shape]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={photo.label}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className={`relative h-full w-full bg-gradient-to-br ${toneClasses[photo.tone]} flex items-end p-4`}
        >
          <div className="absolute inset-0 opacity-[0.06] mix-blend-multiply bg-[radial-gradient(circle_at_30%_20%,#000,transparent_60%)]" />
          <span className="relative font-sans text-[11px] uppercase tracking-[0.14em] text-black/55 leading-snug">
            {photo.label}
          </span>
        </div>
      )}
      {shape === 'polaroid' && (
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
      )}
    </motion.figure>
  )
}
