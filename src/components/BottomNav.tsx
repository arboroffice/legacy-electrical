import { NavLink } from 'react-router-dom'

const links = [
  { to: '/crew', label: 'Today', icon: '📋' },
  { to: '/crew/jobs', label: 'Jobs', icon: '🏗️' },
  { to: '/crew/time', label: 'Time', icon: '⏱️' },
  { to: '/crew/profile', label: 'Me', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-zinc-900 border-t border-zinc-800 flex z-40">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-3 text-xs font-medium transition ${
              isActive ? 'text-blue-400' : 'text-zinc-500'
            }`
          }
        >
          <span className="text-lg">{link.icon}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
