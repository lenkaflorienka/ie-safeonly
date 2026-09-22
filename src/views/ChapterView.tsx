import { useEffect } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { chapterById, chapters } from '../data/locations'
import { PageShell } from '../components/PageShell'
import { PlaceCard } from '../components/PlaceCard'
import { useMusic } from '../context/MusicContext'

export function ChapterView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const chapter = id ? chapterById(id) : undefined
  const { suggestMood } = useMusic()

  useEffect(() => {
    if (chapter) suggestMood(chapter.mood)
  }, [chapter, suggestMood])

  if (!chapter) return <Navigate to="/map" replace />

  const idx = chapters.findIndex((c) => c.id === chapter.id)

  return (
    <PageShell
      eyebrow={`${chapter.chapterLabel} · ${chapter.dateLabel}`}
      title={chapter.name}
      subtitle={chapter.blurb}
      mood={chapter.mood}
    >
      <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {chapter.places.map((place, i) => (
          <PlaceCard key={place.id} place={place} index={i} dateLabel={chapter.dateLabel} />
        ))}
      </div>

      <div className="mt-14 flex items-center justify-center gap-3">
        {idx > 0 && (
          <button
            onClick={() => navigate(`/chapter/${chapters[idx - 1].id}`)}
            className="rounded-full border border-[var(--color-ink)]/20 px-5 py-2.5 font-sans text-xs uppercase tracking-[0.14em] text-[var(--color-ink)]"
          >
            ← {chapters[idx - 1].chapterLabel}
          </button>
        )}
        {idx < chapters.length - 1 && (
          <button
            onClick={() => navigate(`/chapter/${chapters[idx + 1].id}`)}
            className="rounded-full border border-[var(--color-ink)]/20 px-5 py-2.5 font-sans text-xs uppercase tracking-[0.14em] text-[var(--color-ink)]"
          >
            {chapters[idx + 1].chapterLabel} →
          </button>
        )}
      </div>
    </PageShell>
  )
}
