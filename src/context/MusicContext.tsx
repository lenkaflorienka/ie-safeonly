import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { songs, songForMood } from '../data/music'
import type { ChapterMood, Song } from '../data/types'

interface MusicContextValue {
  current: Song
  isPlaying: boolean
  isUnavailable: boolean
  toggle: () => void
  next: () => void
  prev: () => void
  choose: (id: string) => void
  /** Called by views to suggest a mood-appropriate track, unless the
   * visitor has already picked one of their own this session. */
  suggestMood: (mood: ChapterMood) => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isUnavailable, setIsUnavailable] = useState(false)
  const userChose = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const current = songs[index]

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const el = new Audio()
      el.preload = 'none'
      el.addEventListener('error', () => setIsUnavailable(true))
      el.addEventListener('ended', () => setIsPlaying(false))
      audioRef.current = el
    }
    return audioRef.current
  }, [])

  const loadAndMaybePlay = useCallback(
    (i: number, autoplay: boolean) => {
      const el = ensureAudio()
      setIsUnavailable(false)
      el.pause()
      el.src = songs[i].src
      if (autoplay) {
        el.play().catch(() => setIsUnavailable(true))
        setIsPlaying(true)
      }
    },
    [ensureAudio],
  )

  const toggle = useCallback(() => {
    const el = ensureAudio()
    if (isPlaying) {
      el.pause()
      setIsPlaying(false)
      return
    }
    if (!el.src) el.src = current.src
    el.play().catch(() => setIsUnavailable(true))
    setIsPlaying(true)
  }, [current.src, ensureAudio, isPlaying])

  const next = useCallback(() => {
    userChose.current = true
    setIndex((i) => {
      const n = (i + 1) % songs.length
      loadAndMaybePlay(n, isPlaying)
      return n
    })
  }, [isPlaying, loadAndMaybePlay])

  const prev = useCallback(() => {
    userChose.current = true
    setIndex((i) => {
      const n = (i - 1 + songs.length) % songs.length
      loadAndMaybePlay(n, isPlaying)
      return n
    })
  }, [isPlaying, loadAndMaybePlay])

  const choose = useCallback(
    (id: string) => {
      userChose.current = true
      const i = songs.findIndex((s) => s.id === id)
      if (i === -1) return
      setIndex(i)
      loadAndMaybePlay(i, isPlaying)
    },
    [isPlaying, loadAndMaybePlay],
  )

  const suggestMood = useCallback(
    (mood: ChapterMood) => {
      if (userChose.current) return
      const song = songForMood(mood)
      const i = songs.findIndex((s) => s.id === song.id)
      if (i !== -1 && i !== index) {
        setIndex(i)
        if (isPlaying) loadAndMaybePlay(i, true)
      }
    },
    [index, isPlaying, loadAndMaybePlay],
  )

  const value = useMemo(
    () => ({ current, isPlaying, isUnavailable, toggle, next, prev, choose, suggestMood }),
    [current, isPlaying, isUnavailable, toggle, next, prev, choose, suggestMood],
  )

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used within MusicProvider')
  return ctx
}
