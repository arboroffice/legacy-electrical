import { NavLink } from 'react-router-dom'

const links = [
  { to: '/crew', label: 'Today', icon: '📋' },
  { to: '/crew/time', label: 'Time', icon: '⏱️' },
]

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-slate-900 border-t border-slate-800 flex z-40">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-3 text-xs font-medium transition ${
              isActive ? 'text-amber-400' : 'text-slate-500'
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
