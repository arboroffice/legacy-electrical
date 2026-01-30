import { useNavigate } from 'react-router-dom'
import { Zap, Shield, ClipboardList, HardHat } from 'lucide-react'

const roles = [
  {
    id: 'admin',
    title: 'Admin',
    description: 'Full access to all projects, financials, and crew management',
    icon: Shield,
    path: '/admin',
    color: 'blue',
  },
  {
    id: 'pm',
    title: 'Project Manager',
    description: 'Manage projects, schedules, inspections, and invoicing',
    icon: ClipboardList,
    path: '/pm',
    color: 'emerald',
  },
  {
    id: 'crew',
    title: 'Crew',
    description: 'View daily assignments, clock in/out, and log work',
    icon: HardHat,
    path: '/crew',
    color: 'amber',
  },
]

export default function RoleSelect() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8">
        <Zap className="w-10 h-10 text-blue-400" />
        <span className="text-2xl font-bold text-white">Legacy Electrical</span>
      </div>

      <h1 className="text-xl text-zinc-400 mb-8">Select your view</h1>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => navigate(role.path)}
            className={`
              bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left
              hover:border-${role.color}-500/50 hover:bg-zinc-900/80
              transition-all duration-200 group
            `}
          >
            <div className={`
              w-12 h-12 rounded-xl bg-${role.color}-500/10 
              flex items-center justify-center mb-4
              group-hover:bg-${role.color}-500/20 transition-colors
            `}>
              <role.icon className={`w-6 h-6 text-${role.color}-400`} />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">{role.title}</h2>
            <p className="text-sm text-zinc-500">{role.description}</p>
          </button>
        ))}
      </div>

      <p className="text-zinc-600 text-sm mt-8">
        Demo mode — select any role to explore
      </p>
    </div>
  )
}
