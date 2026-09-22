import { Link, useLocation, useNavigate } from 'react-router-dom'

export function TopNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const onMap = location.pathname === '/map'

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
      <button
        onClick={() => (onMap ? navigate(-1) : navigate('/map'))}
        className="rounded-full bg-[var(--color-paper)]/85 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink)] shadow-sm backdrop-blur transition-transform hover:scale-105"
      >
        {onMap ? '← back' : '← map'}
      </button>
      <nav className="flex items-center gap-1.5 rounded-full bg-[var(--color-paper)]/85 p-1 shadow-sm backdrop-blur">
        <NavLink to="/map" label="map" active={location.pathname === '/map'} />
        <NavLink to="/people" label="people" active={location.pathname === '/people'} />
        <NavLink to="/replay" label="replay" active={location.pathname.startsWith('/replay')} />
        <NavLink to="/ending" label="epilogue" active={location.pathname === '/ending'} />
      </nav>
    </header>
  )
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`rounded-full px-3 py-1.5 font-sans text-[11px] uppercase tracking-[0.1em] transition-colors ${
        active
          ? 'bg-[var(--color-ink)] text-[var(--color-paper)]'
          : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-deep)]'
      }`}
    >
      {label}
    </Link>
  )
}
