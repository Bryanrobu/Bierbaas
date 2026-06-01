import "./footer.css"
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { id: 'home',   label: 'Home',   path: '/',       icon: 'M3 9.75L12 3l9 6.75V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.75z M9 22V12h6v10' },
  { id: 'review', label: 'Review', path: '/review', icon: 'M12 5v14 M5 12h14' },
  { id: 'map',    label: 'Map',    path: '/map',    icon: 'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6 M9 3v15 M15 6v15' },
];

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="footer">
      {NAV_ITEMS.map(({ id, label, path, icon }) => {
        const isActive = location.pathname === path
        return (
          <button
            key={id}
            className={`footer-item${isActive ? ' footer-item--active' : ''}`}
            onClick={() => navigate(path)}
          >
            <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={icon} />
            </svg>
            <span className="footer-label">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}