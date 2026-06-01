import {
  FileCheck2,
  Github,
  Heart,
  Home,
  Info,
  LayoutTemplate,
  Sparkles,
} from 'lucide-react'

interface SidebarProps {
  onLoadDemo: () => void
}

const navigation = [
  { label: 'Overview', icon: Home, isActive: true },
  { label: 'Audit', icon: FileCheck2 },
  { label: 'Templates', icon: LayoutTemplate },
  { label: 'About', icon: Info },
]

export function Sidebar({ onLoadDemo }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div>
        <div className="brand-lockup">
          <span className="brand-name">Gladly</span>
          <Sparkles aria-hidden="true" size={18} strokeWidth={1.6} />
        </div>
        <p className="brand-note">Open-source readiness</p>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(({ label, icon: Icon, isActive }) => (
          <a
            className={`nav-item${isActive ? ' nav-item-active' : ''}`}
            href={`#${label.toLowerCase()}`}
            key={label}
          >
            <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="demo-link" type="button" onClick={onLoadDemo}>
          <Sparkles size={15} />
          Load demo workspace
        </button>
        <a
          className="source-link"
          href="https://github.com/Mangomangoman1/GladlyOSS"
          rel="noreferrer"
          target="_blank"
        >
          <Github size={15} />
          View source
        </a>
        <p className="made-with-care">
          Open source with <Heart aria-label="care" size={12} fill="currentColor" />
        </p>
        <span className="version">v0.1.0</span>
      </div>
    </aside>
  )
}
