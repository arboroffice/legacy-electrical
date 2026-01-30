import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import BottomNav from '../../components/BottomNav'
import { PROJECT_PHASES } from '../../types'

const mockProject = {
  id: '1', name: 'Sunrise Heights Lot 12', address: '1234 Sunrise Blvd, Edmond OK',
  builder_name: 'Homes by Taber', current_phase: 3, contract_amount: 14500,
}

const mockTasks = [
  { id: 't1', title: 'Make material list', done: false },
  { id: 't2', title: 'Install conduit runs', done: false },
  { id: 't3', title: 'Pull wire for temp pole', done: true },
]

const mockMaterials = [
  { item: '12/2 Romex (250ft)', qty: 4, status: 'delivered' },
  { item: '6" LED Can Lights', qty: 24, status: 'ordered' },
  { item: '4" Junction Boxes', qty: 12, status: 'delivered' },
]

const mockPhotos = [
  { id: '1', label: 'Conduit run - kitchen', date: 'Jan 14' },
  { id: '2', label: 'Panel rough-in', date: 'Jan 12' },
]

export default function CrewProject() {
  const { id: _id } = useParams()
  const project = mockProject
  const [tasks, setTasks] = useState(mockTasks)
  const [note, setNote] = useState('')

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: !t.done } : t))
  }

  const phase = PROJECT_PHASES.find(p => p.number === project.current_phase)!

  return (
    <Layout>
      <div className="space-y-6 pb-24 lg:pb-6">
        <div>
          <Link to="/crew" className="text-slate-400 hover:text-white text-sm mb-2 inline-block">← Back</Link>
          <h1 className="text-xl font-bold text-white">{project.name}</h1>
          <p className="text-slate-400 text-sm">{project.address}</p>
          <p className="text-slate-500 text-sm mt-1">Builder: {project.builder_name}</p>
        </div>

        {/* Phase Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Current Phase</span>
            <span className="text-amber-400 font-medium text-sm">Phase {project.current_phase}: {phase.name}</span>
          </div>
          <div className="flex gap-1">
            {PROJECT_PHASES.map((p) => (
              <div key={p.number} className={`h-2 flex-1 rounded-full ${
                p.number <= project.current_phase ? 'bg-amber-500' : 'bg-slate-700'
              }`} />
            ))}
          </div>
        </div>

        {/* My Tasks */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-3">My Tasks</h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <label key={task.id} className="flex items-center gap-3 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                />
                <span className={`text-sm ${task.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                  {task.title}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Materials */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-3">Materials</h2>
          <div className="space-y-2">
            {mockMaterials.map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-slate-200 text-sm">{m.item}</p>
                  <p className="text-slate-500 text-xs">Qty: {m.qty}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  m.status === 'delivered' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">My Photos</h2>
            <button className="text-sm bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-700 min-h-[48px]">📸 Upload</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {mockPhotos.map((photo) => (
              <div key={photo.id} className="bg-slate-800 rounded-lg overflow-hidden">
                <div className="aspect-square flex items-center justify-center text-3xl bg-slate-700">📷</div>
                <div className="p-2">
                  <p className="text-slate-300 text-xs">{photo.label}</p>
                  <p className="text-slate-500 text-xs">{photo.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-3">Notes</h2>
          <div className="flex gap-2">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-3 text-white text-sm min-h-[48px]"
            />
            <button className="bg-amber-500 text-slate-900 rounded-lg px-4 font-medium text-sm min-h-[48px]">Add</button>
          </div>
        </div>
      </div>

      <BottomNav />
    </Layout>
  )
}
