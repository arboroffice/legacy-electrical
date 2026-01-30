import { useState, useEffect, useRef } from 'react'
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

const safetyItems = [
  'PPE Check (hard hat, safety glasses, gloves)',
  'LOTO verification',
  'Fire extinguisher located',
]

export default function CrewProject() {
  const { id: _id } = useParams()
  const project = mockProject
  const [tasks, setTasks] = useState(mockTasks)
  const [note, setNote] = useState('')
  const [safetyChecks, setSafetyChecks] = useState<Record<number, boolean>>({})
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimerSeconds(s => s + 1), 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning])

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h}h ${m.toString().padStart(2, '0')}m ${sec.toString().padStart(2, '0')}s`
  }

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: !t.done } : t))
  }

  const toggleSafety = (idx: number) => {
    setSafetyChecks(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const phase = PROJECT_PHASES.find(p => p.number === project.current_phase)!

  return (
    <Layout>
      <div className="space-y-6 pb-24 lg:pb-6">
        <div>
          <Link to="/crew" className="text-zinc-400 hover:text-white text-sm mb-2 inline-block">← Back</Link>
          <h1 className="text-xl font-bold text-white">{project.name}</h1>
          <p className="text-zinc-400 text-sm">{project.address}</p>
          <p className="text-zinc-500 text-sm mt-1">Builder: {project.builder_name}</p>
        </div>

        {/* Job Timer */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-blue-400 text-xs font-medium">⏱️ Time on job today</p>
            <p className="text-white text-xl font-bold font-mono">{formatTime(timerSeconds)}</p>
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>

        {/* Directions */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-blue-600 text-white text-center py-4 rounded-xl text-base font-semibold hover:bg-blue-500 transition min-h-[56px]"
        >
          🗺️ Get Directions
        </a>

        {/* Phase Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-sm">Current Phase</span>
            <span className="text-blue-400 font-medium text-sm">Phase {project.current_phase}: {phase.name}</span>
          </div>
          <div className="flex gap-1">
            {PROJECT_PHASES.map((p) => (
              <div key={p.number} className={`h-2 flex-1 rounded-full ${
                p.number <= project.current_phase ? 'bg-blue-500' : 'bg-zinc-700'
              }`} />
            ))}
          </div>
        </div>

        {/* Safety Checklist */}
        <div className="bg-zinc-900 border border-yellow-500/30 rounded-xl p-5">
          <h2 className="text-yellow-400 font-semibold mb-3">⚠️ Safety Checklist</h2>
          <div className="space-y-3">
            {safetyItems.map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={safetyChecks[i] || false}
                  onChange={() => toggleSafety(i)}
                  className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-green-500 focus:ring-green-500"
                />
                <span className={`text-sm ${safetyChecks[i] ? 'text-green-400' : 'text-slate-200'}`}>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-3">📞 Contacts</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-200 text-sm">PM: Sarah Johnson</p>
              </div>
              <a href="tel:4055550142" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium min-h-[48px] flex items-center">
                📞 Call
              </a>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-200 text-sm">Builder: Homes by Taber</p>
              </div>
              <a href="tel:4055550200" className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium min-h-[48px] flex items-center">
                📞 Call
              </a>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-slate-200 text-sm">Emergency</p>
              <a href="tel:911" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium min-h-[48px] flex items-center">
                🚨 911
              </a>
            </div>
          </div>
        </div>

        {/* My Tasks */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-3">My Tasks</h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <label key={task.id} className="flex items-center gap-3 cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                />
                <span className={`text-sm ${task.done ? 'text-zinc-500 line-through' : 'text-slate-200'}`}>
                  {task.title}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Materials */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-3">Materials</h2>
          <div className="space-y-2">
            {mockMaterials.map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-slate-200 text-sm">{m.item}</p>
                  <p className="text-zinc-500 text-xs">Qty: {m.qty}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  m.status === 'delivered' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">My Photos</h2>
            <button className="text-sm bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg hover:bg-zinc-700 min-h-[48px]">📸 Upload</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {mockPhotos.map((photo) => (
              <div key={photo.id} className="bg-zinc-800 rounded-lg overflow-hidden">
                <div className="aspect-square flex items-center justify-center text-3xl bg-zinc-700">📷</div>
                <div className="p-2">
                  <p className="text-zinc-300 text-xs">{photo.label}</p>
                  <p className="text-zinc-500 text-xs">{photo.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-3">Notes</h2>
          <div className="flex gap-2">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-3 text-white text-sm min-h-[48px]"
            />
            <button className="bg-blue-500 text-slate-900 rounded-lg px-4 font-medium text-sm min-h-[48px]">Add</button>
          </div>
        </div>
      </div>

      <BottomNav />
    </Layout>
  )
}
