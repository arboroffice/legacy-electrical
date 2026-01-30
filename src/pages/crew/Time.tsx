import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import BottomNav from '../../components/BottomNav'

const mockTimeEntries = [
  { date: 'Mon, Jan 15', project: 'Sunrise Heights Lot 12', hours: 8.0, notes: 'Rough-in wiring' },
  { date: 'Tue, Jan 16', project: 'Oak Ridge Lot 7', hours: 7.5, notes: 'Panel install' },
  { date: 'Wed, Jan 17', project: 'Sunrise Heights Lot 12', hours: 8.5, notes: 'Can lights + boxes' },
  { date: 'Thu, Jan 18', project: 'Brookstone Lot 22', hours: 6.0, notes: 'Slab conduit' },
]

const projects = [
  'Sunrise Heights Lot 12',
  'Oak Ridge Lot 7',
  'Brookstone Lot 22',
  'The Reserve Lot 5',
]

export default function CrewTime() {
  const [clockedIn, setClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState<Date | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [selectedProject, setSelectedProject] = useState(projects[0])

  useEffect(() => {
    if (!clockedIn || !clockInTime) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - clockInTime.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [clockedIn, clockInTime])

  const toggleClock = () => {
    if (clockedIn) {
      setClockedIn(false)
      setClockInTime(null)
      setElapsed(0)
    } else {
      setClockedIn(true)
      setClockInTime(new Date())
    }
  }

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const weeklyTotal = mockTimeEntries.reduce((sum, e) => sum + e.hours, 0)

  return (
    <Layout>
      <div className="space-y-6 pb-24 lg:pb-6">
        <h1 className="text-2xl font-bold text-white">Time Clock</h1>

        {/* Clock In/Out */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center space-y-4">
          {/* Timer Display */}
          {clockedIn && (
            <div>
              <p className="text-5xl font-mono text-blue-400 font-bold">{formatElapsed(elapsed)}</p>
              <p className="text-zinc-400 text-sm mt-2">
                Clocked in at {clockInTime?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
          )}

          {/* Project Select */}
          <div>
            <label className="text-zinc-400 text-sm block mb-2">Working on:</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm min-h-[48px]"
            >
              {projects.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Big Clock Button */}
          <button
            onClick={toggleClock}
            className={`w-full py-5 rounded-xl text-xl font-bold transition min-h-[64px] ${
              clockedIn
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            {clockedIn ? '⏹ Clock Out' : '▶ Clock In'}
          </button>
        </div>

        {/* Time History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">This Week</h2>
            <span className="text-blue-400 font-bold">{weeklyTotal}h total</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-slate-800">
            {mockTimeEntries.map((entry, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium">{entry.date}</span>
                  <span className="text-blue-400 font-semibold">{entry.hours}h</span>
                </div>
                <p className="text-zinc-400 text-sm">{entry.project}</p>
                {entry.notes && <p className="text-zinc-500 text-xs mt-1">{entry.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </Layout>
  )
}
