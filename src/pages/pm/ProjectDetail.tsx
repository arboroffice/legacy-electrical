import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { PROJECT_PHASES, DEFAULT_PHASE_TASKS } from '../../types'

const PHASE_COLORS: Record<number, string> = {
  1: 'bg-blue-500', 2: 'bg-orange-500', 3: 'bg-yellow-500',
  4: 'bg-amber-500', 5: 'bg-green-500', 6: 'bg-emerald-500',
}

const mockProject = {
  id: '1', name: 'Sunrise Heights Lot 12', address: '1234 Sunrise Blvd, Edmond OK',
  builder_name: 'Homes by Taber', current_phase: 3, contract_amount: 14500,
  status: 'active' as const,
}

const mockMaterials = [
  { id: '1', item: '200A Panel', quantity: 1, status: 'requested', cost: 320 },
  { id: '2', item: '12/2 Romex (250ft)', quantity: 4, status: 'approved', cost: 180 },
  { id: '3', item: '6" LED Can Lights', quantity: 24, status: 'requested', cost: 288 },
]

const mockChangeOrders = [
  { id: '1', description: 'Add 3 recessed lights in master bath', amount: 450, status: 'pending' },
]

const mockNotes = [
  { date: '2024-01-15', text: 'Builder confirmed can delivery for Thursday', by: 'PM' },
  { date: '2024-01-14', text: 'Walk through complete, plans redlined', by: 'PM' },
  { date: '2024-01-12', text: 'Slab materials installed', by: 'Crew' },
]

const mockPhotos = [
  { id: '1', phase: 2, label: 'Slab conduit run', date: '2024-01-10' },
  { id: '2', phase: 2, label: 'Temp pole installed', date: '2024-01-08' },
  { id: '3', phase: 3, label: 'Redlined plans', date: '2024-01-14' },
]

export default function PMProjectDetail() {
  const { id } = useParams()
  const project = mockProject

  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set(['Print plans', 'Schedule temp pole install', 'Sub installs temp pole', 'Schedule slab install', 'Order slab materials to job site or sub location', 'Sub installs materials']))
  const [activeTab, setActiveTab] = useState<'tasks' | 'materials' | 'changes' | 'photos' | 'notes'>('tasks')
  const [showInspectionForm, setShowInspectionForm] = useState(false)
  const [showChangeOrderForm, setShowChangeOrderForm] = useState(false)

  const toggleTask = (title: string) => {
    setCheckedTasks(prev => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  const tabs = [
    { key: 'tasks', label: 'Phase Tasks', icon: '✅' },
    { key: 'materials', label: 'Materials', icon: '📦' },
    { key: 'changes', label: 'Change Orders', icon: '📝' },
    { key: 'photos', label: 'Photos', icon: '📸' },
    { key: 'notes', label: 'Notes', icon: '💬' },
  ] as const

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link to="/pm" className="text-slate-400 hover:text-white text-sm mb-2 inline-block">← Back to Dashboard</Link>
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <p className="text-slate-400">{project.address}</p>
            <p className="text-slate-500 text-sm mt-1">Builder: {project.builder_name} · Contract: <span className="text-amber-400">${project.contract_amount.toLocaleString()}</span></p>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Phase Progress</h2>
          <div className="flex gap-2">
            {PROJECT_PHASES.map((phase) => (
              <div key={phase.number} className="flex-1 text-center">
                <div className={`h-2 rounded-full mb-1 ${phase.number <= project.current_phase ? PHASE_COLORS[phase.number] : 'bg-slate-700'}`} />
                <span className={`text-xs ${phase.number === project.current_phase ? 'text-white font-medium' : 'text-slate-500'}`}>
                  {phase.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg font-medium text-sm hover:bg-amber-400 transition">
            💰 Create Invoice (65%)
          </button>
          <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 transition"
            onClick={() => setShowInspectionForm(!showInspectionForm)}>
            🔍 Schedule Inspection
          </button>
          <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 transition"
            onClick={() => setShowChangeOrderForm(!showChangeOrderForm)}>
            📝 New Change Order
          </button>
          <label className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 transition cursor-pointer">
            📄 Upload Document
            <input type="file" className="hidden" />
          </label>
        </div>

        {/* Inspection Form */}
        {showInspectionForm && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-white font-medium">Schedule Inspection</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm">
                <option>Rough-In Inspection</option>
                <option>Final Inspection</option>
                <option>Re-Inspection</option>
              </select>
              <input type="date" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" />
              <button className="bg-amber-500 text-slate-900 rounded-lg px-4 py-2 font-medium text-sm hover:bg-amber-400">Schedule</button>
            </div>
          </div>
        )}

        {/* Change Order Form */}
        {showChangeOrderForm && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-white font-medium">New Change Order</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input placeholder="Description" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm md:col-span-2" />
              <input type="number" placeholder="Amount" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <button className="bg-amber-500 text-slate-900 rounded-lg px-4 py-2 font-medium text-sm hover:bg-amber-400">Submit</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab.key ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            {PROJECT_PHASES.map((phase) => {
              const tasks = DEFAULT_PHASE_TASKS[phase.number] || []
              const isCurrent = phase.number === project.current_phase
              const isPast = phase.number < project.current_phase
              return (
                <div key={phase.number} className={`bg-slate-900 border rounded-xl p-4 ${isCurrent ? 'border-amber-500/30' : 'border-slate-800'}`}>
                  <h3 className={`text-sm font-semibold mb-3 ${isCurrent ? 'text-amber-400' : isPast ? 'text-green-400' : 'text-slate-500'}`}>
                    Phase {phase.number}: {phase.name} {isPast && '✓'}
                  </h3>
                  <div className="space-y-2">
                    {tasks.map((task) => {
                      const key = task.title
                      const checked = checkedTasks.has(key)
                      return (
                        <label key={key} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleTask(key)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                          />
                          <span className={`text-sm ${checked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                            {task.title}
                          </span>
                          <span className={`text-xs ml-auto px-2 py-0.5 rounded-full ${task.role === 'pm' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                            {task.role.toUpperCase()}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
            {mockMaterials.map((m) => (
              <div key={m.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">{m.item}</p>
                  <p className="text-slate-500 text-xs">Qty: {m.quantity} · ${m.cost}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    m.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {m.status}
                  </span>
                  {m.status === 'requested' && (
                    <button className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-500">Approve</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'changes' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
            {mockChangeOrders.map((co) => (
              <div key={co.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">{co.description}</p>
                  <p className="text-amber-400 text-xs font-medium">${co.amount}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">{co.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mockPhotos.map((photo) => (
              <div key={photo.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="aspect-square bg-slate-800 flex items-center justify-center text-4xl">📷</div>
                <div className="p-3">
                  <p className="text-white text-sm">{photo.label}</p>
                  <p className="text-slate-500 text-xs">Phase {photo.phase} · {photo.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input placeholder="Add a note..." className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" />
              <button className="bg-amber-500 text-slate-900 rounded-lg px-4 py-2 font-medium text-sm">Add</button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
              {mockNotes.map((note, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-500">{note.date}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${note.by === 'PM' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>{note.by}</span>
                  </div>
                  <p className="text-slate-300 text-sm">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
