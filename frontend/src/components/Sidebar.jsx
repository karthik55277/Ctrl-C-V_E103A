import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/sidebar.css'

const Sidebar = ({ showTitle = true, title = 'AI Modules' }) => {
  const location = useLocation()

  const links = [
    { path: '/dashboard', icon: '📊', label: 'Overview' },
    { path: '/growth', icon: '📋', label: 'Growth Plan' },
    { path: '/content', icon: '✍️', label: 'Content Assistant' },
    { path: '/engagement', icon: '💬', label: 'Engagement' },
    { path: '/performance', icon: '📈', label: 'Performance' },
    { path: '/fundraising', icon: '🤝', label: 'Fundraising' },
  ]

  return (
    <aside className="sidebar">
      {showTitle && <h3>{title}</h3>}
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={location.pathname === link.path ? 'active' : ''}
        >
          {link.icon} {link.label}
        </Link>
      ))}
    </aside>
  )
}

export default Sidebar
