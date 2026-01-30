import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronRight, CheckSquare, Square, FileText, Package, ClipboardCheck, DollarSign, Clock } from 'lucide-react'
import Layout from '../../components/Layout'
import { PROJECT_PHASES, DEFAULT_PHASE_TASKS } from '../../types'

const MOCK_PROJECTS: Record<string, { id: string; name: string; address: string; builder_name: string; contract_amount: number; current_phase: number; status: string; pm: string; crew: string[]; days_in_phase: number; change_orders: number }> = {
  '1': { id: '1', name: '142 Oak Ridge Dr', address: '142 Oak Ridge Dr, Sulphur, LA', builder_name: 'Acadiana Homes', contract_amount: 28500, current_phase: 3, status: 'active', pm: 'Tyler Menard', crew: ['Marcus Landry', 'Jake Thibodaux'], days_in_phase: 4, change_orders: 1 },
  '2': { id: '2', name: '891 Cypress Bend', address: '891 Cypress Bend, Lake Charles, LA', builder_name: 'Cameron Builders', contract_amount: 42000, current_phase: 4, status: 'active', pm: 'Tyler Menard', crew: ['Marcus Landry', 'Beau Fontenot'], days_in_phase: 7, change_orders: 2 },
  '3': { id: '3', name: '2200 Magnolia Estates', address: '2200 Magnolia Estates, Sulphur, LA', builder_name: 'Legacy Homes LLC', contract_amount: 35750, current_phase: 1, status: 'active', pm: 'Tyler Menard', crew: [], days_in_phase: 2, change_orders: 0 },
  '4': { id: '4', name: '567 Pelican Way', address: '567 Pelican Way, DeQuincy, LA', builder_name: 'Gulf Coast Dev', contract_amount: 52000, current_phase: 5, status: 'active', pm: 'Tyler Menard', crew: ['Jake Thibodaux', 'Corey Breaux'], days_in_phase: 3, change_orders: 3 },
  '5': { id: '5', name: '1800 Bayou Park', address: '1800 Bayou Park, Westlake, LA', builder_name: 'Acadiana Homes', contract_amount: 31200, current_phase: 2, status: 'active', pm: 'Tyler Menard', crew: ['Marcus Landry'], days_in_phase: 5, change_orders: 0 },
}

const phaseColorClasses: Record<string, string> = {
  blue: 'bg-blue-500/20 text-blue-400',
  orange: 'bg-orange-500/20 text-orange-400',
  yellow: 'bg-yellow-500/20 text-yellow-400',
  amber: 'bg-blue-500/20 text-blue-400',
  green: 'bg-green-500/20 text-green-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
}

const TABS = ['Documents', 'Materials', 'Inspections', 'Change Orders', 'Activity Log']

export default function AdminProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = MOCK_PROJECTS[id || '1']
  const [expandedPhase, setExpandedPhase] = useState<number>(project?.current_phase || 1)
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState(0)

  if (!project) {
    return <Layout><div className="text-white">Project not found</div></Layout>
  }

  const toggleTask = (key: string) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const amt65 = project.contract_amount * 0.65
  const amt35 = project.contract_amount * 0.35
  const invoicePaid65 = project.current_phase >= 5
  const invoicePaid35 = project.current_phase >= 6

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back + Header */}
        <button onClick={() => navigate('/admin/projects')} className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm transition">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <p className="text-zinc-400 text-sm mt-1">{project.address}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-zinc-300">{project.builder_name}</span>
              <span className="text-sm text-blue-400 font-medium">${project.contract_amount.toLocaleString()}</span>
              {(() => {
                const phase = PROJECT_PHASES.find((p) => p.number === project.current_phase)
                return phase ? (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${phaseColorClasses[phase.color]}`}>
                    {phase.name}
                  </span>
                ) : null
              })()}
            </div>
          </div>
        </div>

        {/* Phase Progress Bar */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            {PROJECT_PHASES.map((phase, i) => {
              const isComplete = phase.number < project.current_phase
              const isCurrent = phase.number === project.current_phase
              return (
                <div key={phase.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isComplete ? 'bg-emerald-500 text-white' :
                      isCurrent ? 'bg-blue-500 text-white' :
                      'bg-zinc-700 text-zinc-400'
                    }`}>
                      {phase.number}
                    </div>
                    <span className={`text-xs mt-1.5 ${isCurrent ? 'text-blue-400 font-medium' : 'text-zinc-500'}`}>
                      {phase.name}
                    </span>
                  </div>
                  {i < PROJECT_PHASES.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${isComplete ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main: Phase Checklist */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-semibold text-white">Phase Checklist</h2>
            {PROJECT_PHASES.map((phase) => {
              const tasks = DEFAULT_PHASE_TASKS[phase.number] || []
              const isOpen = expandedPhase === phase.number
              const isCurrent = phase.number === project.current_phase
              const isComplete = phase.number < project.current_phase
              return (
                <div key={phase.number} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedPhase(isOpen ? -1 : phase.number)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                  >
                    <div className="flex items-center gap-3">
                      {isOpen ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                      <span className={`text-sm font-medium ${isCurrent ? 'text-blue-400' : isComplete ? 'text-emerald-400' : 'text-zinc-400'}`}>
                        Phase {phase.number}: {phase.name}
                      </span>
                      {isComplete && <span className="text-xs text-emerald-400">✓ Complete</span>}
                      {isCurrent && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Current</span>}
                    </div>
                    <span className="text-xs text-zinc-500">{tasks.length} tasks</span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-zinc-800 divide-y divide-slate-800/50">
                      {tasks.map((task, ti) => {
                        const key = `${phase.number}-${ti}`
                        const done = isComplete || completedTasks.has(key)
                        return (
                          <div key={ti} className="flex items-center gap-3 px-4 py-2.5">
                            <button onClick={() => !isComplete && toggleTask(key)} className="flex-shrink-0">
                              {done ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                            </button>
                            <span className={`text-sm flex-1 ${done ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>{task.title}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              task.role === 'pm' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-pink-500/20 text-pink-400'
                            }`}>
                              {task.role.toUpperCase()}
                            </span>
                            {done && <span className="text-xs text-slate-600">Completed</span>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Invoice Summary */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Invoice Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">65% Draw</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white">${amt65.toLocaleString()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${invoicePaid65 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                      {invoicePaid65 ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">35% Draw</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white">${amt35.toLocaleString()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${invoicePaid35 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700 text-zinc-400'}`}>
                      {invoicePaid35 ? 'Paid' : 'Not Due'}
                    </span>
                  </div>
                </div>
                <div className="border-t border-zinc-800 pt-2 mt-2 flex items-center justify-between">
                  <span className="text-sm text-zinc-300 font-medium">Total</span>
                  <span className="text-sm text-blue-400 font-bold">${project.contract_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-zinc-400">Days in Phase</span><span className="text-white">{project.days_in_phase}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Change Orders</span><span className="text-white">{project.change_orders}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Phase</span><span className="text-white">{project.current_phase} of 6</span></div>
              </div>
            </div>

            {/* Team */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Team</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-medium">PM</span>
                  <span className="text-sm text-zinc-300">{project.pm}</span>
                </div>
                {project.crew.map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-medium">Crew</span>
                    <span className="text-sm text-zinc-300">{c}</span>
                  </div>
                ))}
                {project.crew.length === 0 && <p className="text-xs text-zinc-500">No crew assigned yet</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <div className="flex gap-1 border-b border-zinc-800 mb-4">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                  activeTab === i ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            {activeTab === 0 && (
              <div className="text-center py-8">
                <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-zinc-400 text-sm">No documents uploaded yet</p>
                <button className="mt-3 text-sm text-blue-400 hover:text-blue-300">Upload Plans</button>
              </div>
            )}
            {activeTab === 1 && (
              <div className="text-center py-8">
                <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-zinc-400 text-sm">Material lists will appear here</p>
              </div>
            )}
            {activeTab === 2 && (
              <div className="text-center py-8">
                <ClipboardCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-zinc-400 text-sm">No inspections scheduled</p>
              </div>
            )}
            {activeTab === 3 && (
              <div className="text-center py-8">
                <DollarSign className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-zinc-400 text-sm">{project.change_orders} change order(s)</p>
                <button className="mt-3 text-sm text-blue-400 hover:text-blue-300">Create Change Order</button>
              </div>
            )}
            {activeTab === 4 && (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-zinc-400 text-sm">Activity timeline coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
