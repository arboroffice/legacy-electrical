import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, DollarSign, Users, FileText, Plus, Clock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import Layout from '../../components/Layout'
// PROJECT_PHASES available from '../../types' if needed

const MOCK_PROJECTS = [
  { id: '1', name: '142 Oak Ridge Dr', address: '142 Oak Ridge Dr, Sulphur, LA', builder_name: 'Acadiana Homes', contract_amount: 28500, current_phase: 3, status: 'active' as const },
  { id: '2', name: '891 Cypress Bend', address: '891 Cypress Bend, Lake Charles, LA', builder_name: 'Cameron Builders', contract_amount: 42000, current_phase: 4, status: 'active' as const },
  { id: '3', name: '2200 Magnolia Estates', address: '2200 Magnolia Estates, Sulphur, LA', builder_name: 'Legacy Homes LLC', contract_amount: 35750, current_phase: 1, status: 'active' as const },
  { id: '4', name: '567 Pelican Way', address: '567 Pelican Way, DeQuincy, LA', builder_name: 'Gulf Coast Dev', contract_amount: 52000, current_phase: 5, status: 'active' as const },
  { id: '5', name: '1800 Bayou Park', address: '1800 Bayou Park, Westlake, LA', builder_name: 'Acadiana Homes', contract_amount: 31200, current_phase: 2, status: 'active' as const },
]

const KANBAN_COLUMNS = [
  { phase: 1, name: 'Awarded', color: 'bg-blue-500' },
  { phase: 2, name: 'Slab', color: 'bg-orange-500' },
  { phase: 3, name: 'Pre Rough', color: 'bg-yellow-500' },
  { phase: 4, name: 'Rough In', color: 'bg-blue-500' },
  { phase: 5, name: 'Power Ready', color: 'bg-green-500' },
  { phase: 6, name: 'Punch Out', color: 'bg-emerald-500' },
  { phase: 7, name: 'Complete', color: 'bg-slate-500' },
]

const MOCK_ACTIVITIES = [
  { id: 1, icon: 'check', desc: 'Inspection passed — Rough In', project: '891 Cypress Bend', time: '12 min ago' },
  { id: 2, icon: 'invoice', desc: '65% invoice sent to Acadiana Homes', project: '142 Oak Ridge Dr', time: '1 hr ago' },
  { id: 3, icon: 'phase', desc: 'Phase advanced to Power Ready', project: '567 Pelican Way', time: '2 hr ago' },
  { id: 4, icon: 'task', desc: 'Slab materials ordered', project: '1800 Bayou Park', time: '3 hr ago' },
  { id: 5, icon: 'crew', desc: 'Marcus assigned to project', project: '2200 Magnolia Estates', time: '4 hr ago' },
  { id: 6, icon: 'alert', desc: 'Change order submitted — $2,400', project: '891 Cypress Bend', time: '5 hr ago' },
  { id: 7, icon: 'check', desc: 'Walk-through completed', project: '142 Oak Ridge Dr', time: '6 hr ago' },
  { id: 8, icon: 'task', desc: 'Plans printed and distributed', project: '2200 Magnolia Estates', time: '8 hr ago' },
  { id: 9, icon: 'invoice', desc: '35% invoice collected', project: '567 Pelican Way', time: '1 day ago' },
  { id: 10, icon: 'phase', desc: 'Project awarded', project: '2200 Magnolia Estates', time: '2 days ago' },
]

function getActivityIcon(type: string) {
  switch (type) {
    case 'check': return <CheckCircle className="w-4 h-4 text-emerald-400" />
    case 'invoice': return <DollarSign className="w-4 h-4 text-blue-400" />
    case 'phase': return <ArrowRight className="w-4 h-4 text-blue-400" />
    case 'task': return <FileText className="w-4 h-4 text-zinc-400" />
    case 'crew': return <Users className="w-4 h-4 text-pink-400" />
    case 'alert': return <AlertTriangle className="w-4 h-4 text-orange-400" />
    default: return <Clock className="w-4 h-4 text-zinc-400" />
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [projects] = useState(MOCK_PROJECTS)

  const totalRevenue = projects.reduce((s, p) => s + p.contract_amount, 0)
  const stats = [
    { label: 'Active Projects', value: projects.length, icon: Zap, color: 'text-blue-400' },
    { label: 'Revenue This Month', value: `$${(totalRevenue * 0.35).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Crew Members', value: 8, icon: Users, color: 'text-pink-400' },
    { label: 'Outstanding Invoices', value: '$18,200', icon: FileText, color: 'text-orange-400' },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-zinc-400 text-sm mt-1">Overview of all operations</p>
          </div>
          <button
            onClick={() => navigate('/admin/projects')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-zinc-400 text-sm">{stat.label}</span>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Project Board</h2>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {KANBAN_COLUMNS.map((col) => {
              const colProjects = projects.filter((p) => p.current_phase === col.phase)
              return (
                <div key={col.phase} className="min-w-[220px] flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <span className="text-sm font-medium text-zinc-300">{col.name}</span>
                    <span className="text-xs text-zinc-500 ml-auto">{colProjects.length}</span>
                  </div>
                  <div className="space-y-2">
                    {colProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => navigate(`/admin/projects/${project.id}`)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 cursor-pointer hover:border-zinc-700 transition"
                      >
                        <div className="text-sm font-medium text-white mb-1">{project.name}</div>
                        <div className="text-xs text-zinc-500 mb-2">{project.builder_name}</div>
                        <div className="w-full bg-zinc-800 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${col.color}`}
                            style={{ width: `${(project.current_phase / 6) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-zinc-500 mt-1.5">${project.contract_amount.toLocaleString()}</div>
                      </div>
                    ))}
                    {colProjects.length === 0 && (
                      <div className="text-xs text-slate-600 text-center py-6 border border-dashed border-zinc-800 rounded-lg">
                        No projects
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-slate-800">
            {MOCK_ACTIVITIES.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                {getActivityIcon(a.icon)}
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-zinc-300">{a.desc}</span>
                  <span className="text-xs text-zinc-500 ml-2">— {a.project}</span>
                </div>
                <span className="text-xs text-slate-600 whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
