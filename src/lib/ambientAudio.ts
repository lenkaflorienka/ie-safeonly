import type { ChapterMood } from '../data/types'

export type AmbientMood = ChapterMood | 'flashback'

/**
 * A tiny generative ambient engine — synthesized entirely in the browser
 * with the Web Audio API. It exists so the music player produces real,
 * mood-matched sound without bundling the copyrighted reference tracks.
 * Swap in a licensed file for a song (see public/audio/README.md) and the
 * player prefers that instead — this is only the fallback.
 */

interface Voice {
  osc: OscillatorNode
  gain: GainNode
}

// Loose, not music-theory-precise chords — just a distinct, pleasant
// colour per mood, roughly voiced low-to-high.
const MOOD_CHORDS: Record<AmbientMood, number[]> = {
  excitement: [261.63, 329.63, 392.0, 523.25], // C E G C — open, bright
  anticipation: [246.94, 311.13, 369.99, 493.88], // B D# F# B — suspended
  wonder: [220.0, 277.18, 329.63, 440.0], // A C# E A — dreamy major
  intensity: [196.0, 233.08, 293.66, 392.0], // G Bb D G — taut minor
  tender: [207.65, 261.63, 311.13, 415.3], // Ab C Eb Ab — soft minor
  home: [174.61, 220.0, 261.63, 349.23], // F A C F — warm, resolved
  flashback: [233.08, 277.18, 349.23, 466.16], // Bb C# F Bb — shimmering
}

const FADE_OUT = 0.8
const FADE_IN = 1.4
const MASTER_VOLUME = 0.1

export class AmbientEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private filter: BiquadFilterNode | null = null
  private voices: Voice[] = []
  private mood: AmbientMood | null = null
  private playing = false

  private ensureGraph(): AudioContext {
    if (this.ctx) return this.ctx

    const AudioCtor =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtor()

    const master = ctx.createGain()
    master.gain.value = 0

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1100

    const delay = ctx.createDelay(2)
    delay.delayTime.value = 0.38
    const feedback = ctx.createGain()
    feedback.gain.value = 0.22
    delay.connect(feedback)
    feedback.connect(delay)

    filter.connect(master)
    filter.connect(delay)
    delay.connect(master)
    master.connect(ctx.destination)

    // slow filter-sweep LFO so the pad breathes instead of sitting static
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.06
    const lfoDepth = ctx.createGain()
    lfoDepth.gain.value = 260
    lfo.connect(lfoDepth)
    lfoDepth.connect(filter.frequency)
    lfo.start()

    this.ctx = ctx
    this.master = master
    this.filter = filter
    return ctx
  }

  private buildVoices(mood: AmbientMood): Voice[] {
    const ctx = this.ensureGraph()
    const freqs = MOOD_CHORDS[mood]
    return freqs.map((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = i === 0 ? 'sine' : 'triangle'
      osc.frequency.value = freq
      osc.detune.value = (i - freqs.length / 2) * 3
      const gain = ctx.createGain()
      gain.gain.value = 0
      osc.connect(gain)
      gain.connect(this.filter!)
      osc.start()
      return { osc, gain }
    })
  }

  async play(mood: AmbientMood) {
    const ctx = this.ensureGraph()
    if (ctx.state === 'suspended') await ctx.resume()
    this.playing = true

    if (this.mood === mood && this.voices.length) {
      const now = ctx.currentTime
      this.master!.gain.cancelScheduledValues(now)
      this.master!.gain.setValueAtTime(this.master!.gain.value, now)
      this.master!.gain.linearRampToValueAtTime(MASTER_VOLUME, now + FADE_IN)
      return
    }
    this.crossfadeTo(mood)
  }

  setMood(mood: AmbientMood) {
    if (!this.playing || this.mood === mood) return
    this.crossfadeTo(mood)
  }

  private crossfadeTo(mood: AmbientMood) {
    const ctx = this.ensureGraph()
    const now = ctx.currentTime
    const outgoing = this.voices

    if (outgoing.length) {
      outgoing.forEach(({ gain }) => {
        gain.gain.cancelScheduledValues(now)
        gain.gain.setValueAtTime(gain.gain.value, now)
        gain.gain.linearRampToValueAtTime(0, now + FADE_OUT)
      })
      window.setTimeout(() => {
        outgoing.forEach(({ osc }) => {
          try {
            osc.stop()
          } catch {
            // already stopped
          }
        })
      }, FADE_OUT * 1000 + 100)
    }

    const incoming = this.buildVoices(mood)
    incoming.forEach(({ gain }, i) => {
      const target = i === 0 ? 0.55 : 0.3
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(target, now + FADE_IN)
    })

    this.voices = incoming
    this.mood = mood

    this.master!.gain.cancelScheduledValues(now)
    this.master!.gain.setValueAtTime(this.master!.gain.value, now)
    this.master!.gain.linearRampToValueAtTime(MASTER_VOLUME, now + FADE_IN)
  }

  stop() {
    this.playing = false
    if (!this.ctx || !this.master) return
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(0, now + 0.5)
  }
}
