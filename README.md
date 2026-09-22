# eleven days in may

A digital memory capsule for the Djarum Foundation International Exposure
2026 delegation — six months of weekend training in Jakarta, eleven days
across Belgium and the Netherlands, EuroMUN 2026, and the twelve people who
were there for all of it.

## Running it locally

```bash
npm install
npm run dev       # dev server
npm run build     # production build -> dist/
npm run preview   # serve the production build locally
npm run lint       # oxlint
```

## Deploying

The build output in `dist/` is fully static — no backend, no environment
variables, no server-side rendering. It can be pushed to any static host
(Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3 + CDN, etc.) as-is.
Routing uses a hash router (`/#/map`, `/#/chapter/brussels`, …) specifically
so it works on any static host without needing SPA rewrite rules configured.

## How the content is organized

Everything specific to this delegation's story lives in `src/data/` and
nowhere else — components read from it, they don't hard-code content.

- **`src/data/types.ts`** — the shape of a chapter, a place, a person, a song.
- **`src/data/locations.ts`** — the journey, as an ordered list of `chapters`
  (Jakarta training → Brussels → The Hague → Maastricht → EuroMUN →
  Amsterdam → home), each with a list of `places` (memory objects).
- **`src/data/people.ts`** — the twelve people.
- **`src/data/music.ts`** — the five songs and their mood associations.

To add a new place, a new chapter, or a new person, edit these files — no
component changes needed. A `PageShell`/`PlaceCard`/`Photo` set of shared
components renders whatever is in the data.

### Placeholders

Anything not yet provided is marked inline as `[ADD MEMORY HERE]`,
`[ADD NAME HERE]`, `[ADD QUOTE HERE]`, `DATE TO CONFIRM`, etc. — directly in
`src/data/*.ts`. Nothing personal has been invented; only publicly known
facts about the landmarks (Atomium, Peace Palace, Rijksmuseum, etc.) are
filled in for real.

### Photos

See `public/photos/README.md` — drop a file in, flip one flag in
`locations.ts`, done.

### Music

See `public/audio/README.md`. The five referenced songs (Landslide,
Unwritten, You're Gonna Live Forever in Me, Slipping Through My Fingers,
deja vu) are **not** bundled — this repo doesn't redistribute copyrighted
recordings. The player UI, mood-based track suggestions, and playback
wiring are all built and ready; add licensed audio files (or point `src` in
`music.ts` at a licensed streaming embed) to turn on playback.

## What this prototype already includes

- An opening "boarding pass" sequence rather than a generic hero.
- A stylised, abstract journey map (Explore mode) connecting Jakarta to
  Brussels, The Hague, Maastricht, EuroMUN, Amsterdam and home — tap any
  chapter to open it.
- A **Replay** mode that walks the whole journey in order, start to finish.
- Seven chapters, each with its known places rendered as varied memory
  cards (not identical/repeated layouts) with "our memory," an optional
  "did you know?" fact, an optional "the little thing" (inside joke), and
  an optional quote.
- A non-corporate representation of the twelve people (ten delegates, Kak
  Ira, Ko Matthew).
- A persistent, mood-aware music control.
- A flashback interaction (blur / film grain / soft focus) triggered by a
  couple of hidden "you had to be there" markers.
- A quiet epilogue with a small photo selection and a way back in.
- A warm, colourful, editorial visual language (Fraunces + Inter), built
  mobile-first, respecting `prefers-reduced-motion`.

## Known limitation: the Google Photos album

The shared album (`photos.app.goo.gl/5imqb2rbZGAKVHzt9`) could not be
inspected while building this — outbound access to `photos.app.goo.gl` is
blocked by this environment's network egress policy (not a permissions or
login issue on the album itself). None of the locations, chronology or
people below were derived from it as a result. If you can open the album
yourself, pulling photos and cross-referencing captions/dates against the
placeholders in `locations.ts` is the fastest path to filling this in.

## What would turn this into the final site

Only what's actually needed — no need to have all of this before it's
useful:

1. **The ten delegates' names** (Kak Ira and Ko Matthew are already in).
2. **Photos** — even a handful to start: one per place is enough to replace
   the placeholder gradients with the real thing.
3. **Memories** — what actually happened at each place. These are the
   `[ADD MEMORY HERE]` placeholders in `locations.ts`; they're the heart of
   the site.
4. **Dates** — actual chronological order and dates for the eleven days
   (currently marked `DATE TO CONFIRM`); also whether the Brussels → The
   Hague → Maastricht → Amsterdam order is correct.
5. **Inside jokes / quotes / "the little thing" details**, wherever they
   exist — these are what make it feel like *this* delegation's trip and
   not a travel guide.
6. **Portraits and personal quotes** for the twelve people, and confirmation
   of who should be publicly named vs. kept anonymous.
7. **Licensed audio files** (or streaming embed links) for the five songs,
   if playback should actually work rather than just showing the UI.
8. Any **additional locations** the photos turn up that aren't listed yet.

Everything else — layout, interaction, navigation, the map, the replay
mode, the music architecture — is already built and will absorb this
content without any redesign.
