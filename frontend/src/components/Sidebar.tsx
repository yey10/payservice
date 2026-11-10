import { NAV_ITEMS } from '../config/navigation'
import type { Route } from '../hooks/useHashRoute'
import Icon from './Icon'

interface SidebarProps {
  current: Route
  open: boolean
  onNavigate: () => void
}

export default function Sidebar({ current, open, onNavigate }: SidebarProps) {
  return (
    <aside className={`sidebar${open ? ' is-open' : ''}`} aria-label="Navegación principal">
      <a className="brand" href="#/" onClick={onNavigate}>
        <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="9" fill="#2fd0ae" />
          <path d="M10 23V9h6.2a4.6 4.6 0 0 1 0 9.2H10" fill="none" stroke="#0d1f1d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>PayServices</span>
      </a>

      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.route}
            href={item.route === 'resumen' ? '#/' : `#/${item.route}`}
            className={`nav-link${current === item.route ? ' is-active' : ''}`}
            aria-current={current === item.route ? 'page' : undefined}
            onClick={onNavigate}
          >
            <Icon name={item.icon} size={19} />
            {item.label}
          </a>
        ))}
      </nav>

      <p className="sidebar-note">Proyecto académico. Los pagos son simulados y no mueven dinero real.</p>
    </aside>
  )
}
