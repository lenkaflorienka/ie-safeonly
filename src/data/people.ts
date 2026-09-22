import type { Person } from './types'

/**
 * The twelve people this website is for: ten delegates and the two
 * Faculty Advisors who made the six months and the eleven days possible.
 * Only Kak Ira and Ko Matthew's names are known at this stage — the rest
 * are clearly marked placeholders, ready to be replaced with real names,
 * quotes and portraits.
 */
export const people: Person[] = [
  {
    id: 'kak-ira',
    name: 'Kak Ira',
    role: 'advisor',
    quote: '[ADD QUOTE HERE]',
    blurb: '[ADD MEMORY HERE]',
  },
  {
    id: 'ko-matthew',
    name: 'Ko Matthew',
    role: 'advisor',
    isCoach: true,
    quote: '[ADD QUOTE HERE]',
    blurb:
      'Coach for six months of weekend training in Jakarta, and Faculty Advisor throughout EuroMUN 2026.',
    placeIds: ['jkt-coach-matthew'],
  },
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `delegate-${i + 1}`,
    name: '[ADD NAME HERE]',
    isPlaceholderName: true,
    role: 'delegate' as const,
    quote: '[ADD QUOTE HERE]',
    blurb: '[ADD MEMORY HERE]',
  })),
]

export const advisors = people.filter((p) => p.role === 'advisor')
export const delegates = people.filter((p) => p.role === 'delegate')
