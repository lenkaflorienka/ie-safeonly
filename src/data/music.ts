import type { Song } from './types'

/**
 * The soundtrack. Copyrighted recordings cannot be bundled with this
 * project, so `src` points at a path under /public/audio that is simply
 * empty for now. Drop a legally-obtained audio file at that path (or swap
 * `src` for a licensed streaming embed URL) and playback starts working
 * with no other changes — the player already handles a missing file
 * gracefully.
 */
export const songs: Song[] = [
  {
    id: 'landslide',
    title: 'Landslide',
    artist: 'Fleetwood Mac',
    mood: 'excitement',
    src: '/audio/landslide.mp3',
    note: 'Six months of weekends, and the feeling of things about to change.',
  },
  {
    id: 'unwritten',
    title: 'Unwritten',
    artist: 'Natasha Bedingfield',
    mood: 'anticipation',
    src: '/audio/unwritten.mp3',
    note: 'The departure. A blank page, and a boarding pass.',
  },
  {
    id: 'live-forever-in-me',
    title: "You're Gonna Live Forever in Me",
    artist: 'John Mayer',
    mood: 'wonder',
    src: '/audio/live-forever-in-me.mp3',
    note: 'Brussels, The Hague, Maastricht — new places, new people to remember.',
  },
  {
    id: 'slipping-through-my-fingers',
    title: 'Slipping Through My Fingers',
    artist: 'Meryl Streep (Mamma Mia!)',
    mood: 'tender',
    src: '/audio/slipping-through-my-fingers.mp3',
    note: 'The last days. Amsterdam, and the quiet realisation it was ending.',
  },
  {
    id: 'deja-vu',
    title: 'deja vu',
    artist: 'Olivia Rodrigo',
    mood: 'flashback',
    src: '/audio/deja-vu.mp3',
    note: 'For the memories that resurface uninvited.',
  },
]

export const songForMood = (mood: Song['mood']) =>
  songs.find((s) => s.mood === mood) ?? songs[0]
