import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
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
  const hasParallax = shape !== 'polaroid' && !prefersReducedMotion

  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], hasParallax ? [-16, 16] : [0, 0])

  return (
    <motion.figure
      ref={containerRef}
      initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ rotate: `${rotate}deg` }}
      className={`group relative overflow-hidden rounded-sm shadow-[0_8px_30px_-10px_rgba(43,36,31,0.35)] ${shapeClasses[shape]} ${className}`}
    >
      <motion.div className="absolute -inset-y-4 inset-x-0" style={{ y: parallaxY }}>
        {src ? (
          <img
            src={src}
            alt={photo.label}
            loading="lazy"
            className="h-full w-full scale-110 object-cover"
          />
        ) : (
          <div className="grain relative h-full w-full overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${toneClasses[photo.tone]} ${
                prefersReducedMotion ? '' : 'motion-safe:[animation:kenburns_22s_ease-in-out_infinite_alternate]'
              }`}
            />
            <div className="absolute inset-0 opacity-[0.08] mix-blend-multiply bg-[radial-gradient(circle_at_30%_20%,#000,transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_6px_rgba(0,0,0,0.08)]" />
            <span className="absolute right-3 top-3 opacity-40">
              <PlaceholderMark />
            </span>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
              <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-black/55 leading-snug">
                {photo.label}
              </span>
              <span className="shrink-0 font-sans text-[9px] uppercase tracking-[0.1em] text-black/35">
                photo to come
              </span>
            </div>
          </div>
        )}
      </motion.div>
      {shape === 'polaroid' && (
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
      )}
    </motion.figure>
  )
}

function PlaceholderMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.4">
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M8 6l1.5-2.5h5L16 6" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}
