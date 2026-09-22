import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { allPlaces } from '../data/locations'
import { Photo } from '../components/Photo'
import { useMusic } from '../context/MusicContext'

const CLOSING_SELECTION = [
  'brussels-atomium',
  'hague-madurodam',
  'maastricht-dadawan',
  'euromun-closing',
  'amsterdam-canals',
  'home-arrival',
]

export function Ending() {
  const { suggestMood } = useMusic()
  useEffect(() => {
    suggestMood('home')
  }, [suggestMood])

  const places = allPlaces()
  const selection = CLOSING_SELECTION.map((id) => places.find((p) => p.id === id)).filter(
    Boolean,
  )

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[var(--color-cream)] via-[var(--color-cream-deep)]/60 to-[var(--color-cream)] px-4 pb-24 pt-28 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-lg text-center"
      >
        <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-[var(--color-ink-soft)]">
          the way home
        </p>
        <h1 className="mt-3 font-display text-3xl leading-snug text-[var(--color-ink)] sm:text-4xl">
          The trip ended.
          <br />
          The memory didn&rsquo;t.
        </h1>
        <p className="mt-4 font-sans text-sm leading-relaxed text-[var(--color-ink-soft)]">
          Six months in Jakarta. Eleven days between Brussels, The Hague, Maastricht and
          Amsterdam. Twelve people who were there for all of it. The route stays marked. The
          photographs stay here. Come back whenever you want to remember it.
        </p>
      </motion.div>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
        {selection.map((place, i) => (
          <Photo
            key={place!.id}
            photo={place!.photo}
            rotate={i % 2 === 0 ? -2 : 2}
            className={i === 0 ? 'col-span-2 sm:col-span-1' : ''}
          />
        ))}
      </div>

      <div className="mx-auto mt-14 flex max-w-lg flex-col items-center gap-3 text-center">
        <Link
          to="/map"
          className="rounded-full bg-[var(--color-ink)] px-7 py-3 font-sans text-xs uppercase tracking-[0.16em] text-[var(--color-paper)]"
        >
          open the map again
        </Link>
        <Link
          to="/people"
          className="font-sans text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)] underline underline-offset-4"
        >
          see the twelve of us
        </Link>
      </div>
    </div>
  )
}
