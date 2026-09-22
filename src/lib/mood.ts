import type { ChapterMood, PhotoTone } from '../data/types'

interface MoodStyle {
  gradient: string
  accent: string
  accentSoft: string
  label: string
}

export const moodStyles: Record<ChapterMood, MoodStyle> = {
  excitement: {
    gradient: 'from-[#fdf6ec] via-[#f6d372]/35 to-[#fdf6ec]',
    accent: '#c98a1f',
    accentSoft: '#f6d372',
    label: 'excitement',
  },
  anticipation: {
    gradient: 'from-[#fdf6ec] via-[#a9d3e8]/40 to-[#fdf6ec]',
    accent: '#3f7ea6',
    accentSoft: '#a9d3e8',
    label: 'anticipation',
  },
  wonder: {
    gradient: 'from-[#fdf6ec] via-[#cbb9e0]/40 to-[#f6ead4]',
    accent: '#7a5ea8',
    accentSoft: '#cbb9e0',
    label: 'wonder',
  },
  intensity: {
    gradient: 'from-[#f6ead4] via-[#ef8354]/30 to-[#fdf6ec]',
    accent: '#b3401f',
    accentSoft: '#ef8354',
    label: 'intensity',
  },
  tender: {
    gradient: 'from-[#fdf6ec] via-[#f2b8bd]/35 to-[#f6ead4]',
    accent: '#b8555c',
    accentSoft: '#f2b8bd',
    label: 'tender',
  },
  home: {
    gradient: 'from-[#f6ead4] via-[#8fae82]/25 to-[#fdf6ec]',
    accent: '#5b7a4e',
    accentSoft: '#8fae82',
    label: 'home',
  },
}

export const toneClasses: Record<PhotoTone, string> = {
  bright: 'from-[#fff7e0] via-[#f6d372] to-[#ef8354]',
  warm: 'from-[#f6ead4] via-[#efb27a] to-[#c1594a]',
  cool: 'from-[#e4f1f7] via-[#a9d3e8] to-[#6fa8c9]',
  muted: 'from-[#eee6da] via-[#c9bfae] to-[#8b8171]',
  gold: 'from-[#fdf1d6] via-[#f6d372] to-[#c98a1f]',
}
