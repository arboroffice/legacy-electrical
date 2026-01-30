import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/projects', label: 'Projects', icon: '🏗️' },
  { to: '/admin/financials', label: 'Financials', icon: '💰' },
  { to: '/admin/crew', label: 'Crew', icon: '👷' },
]

const pmLinks = [
  { to: '/pm', label: 'Dashboard', icon: '📊' },
  { to: '/pm/schedule', label: 'Schedule', icon: '📅' },
]

const crewLinks = [
  { to: '/crew', label: 'Today', icon: '📋' },
  { to: '/crew/time', label: 'Time Clock', icon: '⏱️' },
]

export default function Sidebar() {
  const { user, role, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  const links = role === 'admin' ? adminLinks : role === 'pm' ? pmLinks : crewLinks

  const nav = (
    <>
      {/* Branding */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-lg font-bold text-white tracking-tight">Legacy Electrical</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin' || link.to === '/pm' || link.to === '/crew'}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-slate-800">
        <div className="text-sm text-slate-300 truncate">{user?.email}</div>
        <div className="text-xs text-slate-500 capitalize mb-3">{role}</div>
        <button
          onClick={signOut}
          className="w-full text-sm text-slate-400 hover:text-red-400 transition text-left"
        >
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {nav}
      </aside>
    </>
  )
}
