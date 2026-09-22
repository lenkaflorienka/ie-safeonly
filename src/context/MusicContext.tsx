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
import { AmbientEngine } from '../lib/ambientAudio'

interface MusicContextValue {
  current: Song
  isPlaying: boolean
  /** True while playback is a synthesized stand-in rather than the real file. */
  isAmbientFallback: boolean
  toggle: () => void
  next: () => void
  prev: () => void
  choose: (id: string) => void
  /** Called by views to suggest a mood-appropriate track, unless the
   * visitor has already picked one of their own this session. */
  suggestMood: (mood: ChapterMood) => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

/** HEAD-checks whether a real licensed file has been dropped in at `src`. */
async function realFileExists(src: string): Promise<boolean> {
  try {
    const res = await fetch(src, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAmbientFallback, setIsAmbientFallback] = useState(false)
  const userChose = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ambientRef = useRef<AmbientEngine | null>(null)
  const requestId = useRef(0)

  const current = songs[index]

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const el = new Audio()
      el.preload = 'none'
      el.addEventListener('ended', () => setIsPlaying(false))
      audioRef.current = el
    }
    return audioRef.current
  }, [])

  const ensureAmbient = useCallback(() => {
    if (!ambientRef.current) ambientRef.current = new AmbientEngine()
    return ambientRef.current
  }, [])

  const stopAll = useCallback(() => {
    audioRef.current?.pause()
    ambientRef.current?.stop()
  }, [])

  /** Starts playback for `song`, preferring a real file over the ambient fallback. */
  const startPlayback = useCallback(
    async (song: Song) => {
      const myRequest = ++requestId.current
      stopAll()
      const hasRealFile = await realFileExists(song.src)
      if (myRequest !== requestId.current) return // superseded by a newer request

      if (hasRealFile) {
        const el = ensureAudio()
        el.src = song.src
        try {
          await el.play()
          if (myRequest !== requestId.current) return
          setIsAmbientFallback(false)
          setIsPlaying(true)
          return
        } catch {
          // fall through to ambient
        }
      }

      const ambient = ensureAmbient()
      await ambient.play(song.mood)
      if (myRequest !== requestId.current) return
      setIsAmbientFallback(true)
      setIsPlaying(true)
    },
    [ensureAmbient, ensureAudio, stopAll],
  )

  const toggle = useCallback(() => {
    if (isPlaying) {
      requestId.current++ // invalidate any in-flight start
      stopAll()
      setIsPlaying(false)
      return
    }
    void startPlayback(current)
  }, [current, isPlaying, startPlayback, stopAll])

  const next = useCallback(() => {
    userChose.current = true
    setIndex((i) => {
      const n = (i + 1) % songs.length
      if (isPlaying) void startPlayback(songs[n])
      return n
    })
  }, [isPlaying, startPlayback])

  const prev = useCallback(() => {
    userChose.current = true
    setIndex((i) => {
      const n = (i - 1 + songs.length) % songs.length
      if (isPlaying) void startPlayback(songs[n])
      return n
    })
  }, [isPlaying, startPlayback])

  const choose = useCallback(
    (id: string) => {
      userChose.current = true
      const i = songs.findIndex((s) => s.id === id)
      if (i === -1) return
      setIndex(i)
      if (isPlaying) void startPlayback(songs[i])
    },
    [isPlaying, startPlayback],
  )

  const suggestMood = useCallback(
    (mood: ChapterMood) => {
      if (userChose.current) return
      const song = songForMood(mood)
      const i = songs.findIndex((s) => s.id === song.id)
      if (i === -1 || i === index) return
      setIndex(i)
      if (isPlaying) {
        if (isAmbientFallback) {
          // same engine instance, just crossfade — no need to re-resolve a real file
          ensureAmbient().setMood(song.mood)
        } else {
          void startPlayback(song)
        }
      }
    },
    [ensureAmbient, index, isAmbientFallback, isPlaying, startPlayback],
  )

  const value = useMemo(
    () => ({
      current,
      isPlaying,
      isAmbientFallback,
      toggle,
      next,
      prev,
      choose,
      suggestMood,
    }),
    [current, isPlaying, isAmbientFallback, toggle, next, prev, choose, suggestMood],
  )

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used within MusicProvider')
  return ctx
}
