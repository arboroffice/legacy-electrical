import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { PROJECT_PHASES } from '../../types'

const PHASE_COLORS: Record<number, string> = {
  1: 'bg-blue-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-blue-500',
  5: 'bg-green-500',
  6: 'bg-emerald-500',
}

const PHASE_TEXT_COLORS: Record<number, string> = {
  1: 'text-blue-400 bg-blue-500/10',
  2: 'text-orange-400 bg-orange-500/10',
  3: 'text-yellow-400 bg-yellow-500/10',
  4: 'text-blue-400 bg-blue-500/10',
  5: 'text-green-400 bg-green-500/10',
  6: 'text-emerald-400 bg-emerald-500/10',
}

const mockProjects = [
  {
    id: '1', name: 'Sunrise Heights Lot 12', address: '1234 Sunrise Blvd, Edmond OK',
    builder_name: 'Homes by Taber', current_phase: 3, contract_amount: 14500,
    next_task: 'Schedule walk through', days_in_phase: 4,
  },
  {
    id: '2', name: 'Oak Ridge Lot 7', address: '890 Oak Ridge Dr, Norman OK',
    builder_name: 'Ideal Homes', current_phase: 4, contract_amount: 18200,
    next_task: 'Organize change orders', days_in_phase: 2,
  },
  {
    id: '3', name: 'Brookstone Lot 22', address: '456 Brookstone Way, Yukon OK',
    builder_name: 'Shaw Homes', current_phase: 2, contract_amount: 16800,
    next_task: 'Order slab materials', days_in_phase: 1,
  },
  {
    id: '4', name: 'The Reserve Lot 5', address: '321 Reserve Pkwy, Moore OK',
    builder_name: 'Homes by Taber', current_phase: 5, contract_amount: 21000,
    next_task: 'Schedule delivery', days_in_phase: 6,
  },
  {
    id: '5', name: 'Heritage Point Lot 14', address: '777 Heritage Ln, Mustang OK',
    builder_name: 'Landmark Fine Homes', current_phase: 1, contract_amount: 19500,
    next_task: 'Print plans', days_in_phase: 0,
  },
]

const todaySchedule = [
  { time: '8:00 AM', project: 'Sunrise Heights Lot 12', type: 'Walk Through', typeColor: 'text-yellow-400' },
  { time: '10:30 AM', project: 'Oak Ridge Lot 7', type: 'Inspection', typeColor: 'text-blue-400' },
  { time: '1:00 PM', project: 'The Reserve Lot 5', type: 'Delivery', typeColor: 'text-green-400' },
  { time: '3:00 PM', project: 'Brookstone Lot 22', type: 'Inspection', typeColor: 'text-blue-400' },
]

const pendingActions = {
  invoices: 2,
  materials: 3,
  changeOrders: 1,
  inspections: 2,
}

export default function PMDashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">PM Dashboard</h1>
            <p className="text-zinc-400 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <Link
            to="/pm/schedule"
            className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition text-sm"
          >
            📅 Schedule
          </Link>
        </div>

        {/* Pending Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Invoices to Send', count: pendingActions.invoices, icon: '💰', color: 'text-blue-400' },
            { label: 'Materials to Approve', count: pendingActions.materials, icon: '📦', color: 'text-green-400' },
            { label: 'Change Orders', count: pendingActions.changeOrders, icon: '📝', color: 'text-blue-400' },
            { label: 'Inspections to Schedule', count: pendingActions.inspections, icon: '🔍', color: 'text-purple-400' },
          ].map((action) => (
            <div key={action.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span>{action.icon}</span>
                <span className={`text-2xl font-bold ${action.color}`}>{action.count}</span>
              </div>
              <p className="text-xs text-zinc-400">{action.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Projects */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-white">My Projects</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {mockProjects.map((project) => {
                const phase = PROJECT_PHASES.find(p => p.number === project.current_phase)!
                return (
                  <Link
                    key={project.id}
                    to={`/pm/projects/${project.id}`}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition block"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-medium text-sm">{project.name}</h3>
                        <p className="text-zinc-500 text-xs">{project.address}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${PHASE_TEXT_COLORS[project.current_phase]}`}>
                        {phase.name}
                      </span>
                    </div>

                    <p className="text-zinc-400 text-xs mb-3">Builder: {project.builder_name}</p>

                    {/* Phase Progress Bar */}
                    <div className="flex gap-1 mb-3">
                      {PROJECT_PHASES.map((p) => (
                        <div
                          key={p.number}
                          className={`h-1.5 flex-1 rounded-full ${
                            p.number <= project.current_phase
                              ? PHASE_COLORS[p.number]
                              : 'bg-zinc-700'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">
                        Next: <span className="text-zinc-300">{project.next_task}</span>
                      </span>
                      <span className="text-zinc-500">{project.days_in_phase}d</span>
                    </div>

                    <div className="mt-2 text-right">
                      <span className="text-blue-400 font-semibold text-sm">
                        ${project.contract_amount.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Today's Schedule</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-slate-800">
              {todaySchedule.map((item, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-500 w-16 shrink-0">{item.time}</span>
                    <div>
                      <p className="text-white text-sm">{item.project}</p>
                      <p className={`text-xs ${item.typeColor}`}>{item.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
