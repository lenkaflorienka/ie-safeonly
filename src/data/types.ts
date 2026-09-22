// Shared content types. Kept separate from presentation so photos, memories,
// people and locations can be added or edited without touching components.

export type MemoryCategory =
  | 'training'
  | 'travel'
  | 'food'
  | 'landmark'
  | 'mun'
  | 'candid'
  | 'airport'
  | 'group'
  | 'flashback'
  | 'funny'
  | 'quiet'
  | 'ending'

export type ChapterMood =
  | 'excitement' // training
  | 'anticipation' // departure
  | 'wonder' // brussels / the hague
  | 'intensity' // euromun
  | 'tender' // amsterdam / last days
  | 'home' // return

export type PhotoTone = 'bright' | 'warm' | 'cool' | 'muted' | 'gold'

export interface PhotoPlaceholder {
  /** Short label shown inside the placeholder, e.g. "Atomium, dusk" */
  label: string
  tone: PhotoTone
  /** Aspect treatment hint for layout variety */
  shape?: 'polaroid' | 'strip' | 'full' | 'wide' | 'tall'
  /** Set true once a real photo file exists at /public/photos/<id>.jpg */
  hasRealImage?: boolean
}

export interface Place {
  id: string
  name: string
  /** One line, e.g. "where we got lost for forty minutes" */
  subtitle?: string
  cityId: string
  /** Did-you-know style public fact, short. */
  fact?: string
  /** Personal memory text. If absent, UI shows a placeholder prompt. */
  memory?: string
  /** A tiny detail only the delegation would remember. */
  littleThing?: string
  /** Optional short quote attributed to someone in the delegation. */
  quote?: string
  categories: MemoryCategory[]
  photo: PhotoPlaceholder
  /** Marks a hidden, easter-egg style discovery. */
  isHidden?: boolean
  /** IDs of people (from people.ts) present in this memory, if known. */
  peopleIds?: string[]
}

export interface Chapter {
  id: string
  /** Short chapter word shown on the map, e.g. "BRUSSELS" */
  chapterLabel: string
  name: string
  city?: string
  country?: string
  dateLabel: string // e.g. "Weekends, Nov 2025 – Apr 2026" or "DATE TO CONFIRM"
  blurb: string
  mood: ChapterMood
  /** Position on the stylised route map, 0–100 in both axes. */
  coordinates: { x: number; y: number }
  places: Place[]
}

export type PersonRole = 'delegate' | 'advisor'

export interface Person {
  id: string
  name: string
  isPlaceholderName?: boolean
  role: PersonRole
  isCoach?: boolean
  quote?: string
  blurb?: string
  placeIds?: string[]
}

export interface Song {
  id: string
  title: string
  artist: string
  mood: ChapterMood | 'flashback'
  /** Path under /public/audio — add the real file to enable playback. */
  src: string
  note?: string
}
