import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import BottomNav from '../../components/BottomNav'

const mockAssignments = [
  {
    id: '1', project: 'Sunrise Heights Lot 12', address: '1234 Sunrise Blvd, Edmond OK',
    phase: 'Pre Rough', phaseNum: 3,
    tasks: [
      { id: 't1', title: 'Make material list', done: false },
      { id: 't2', title: 'Install conduit runs', done: false },
    ],
    status: 'not_started' as const,
  },
  {
    id: '2', project: 'Oak Ridge Lot 7', address: '890 Oak Ridge Dr, Norman OK',
    phase: 'Rough In', phaseNum: 4,
    tasks: [
      { id: 't3', title: 'Install materials', done: true },
      { id: 't4', title: 'Pull wire to panel', done: false },
      { id: 't5', title: 'Install boxes & brackets', done: false },
    ],
    status: 'in_progress' as const,
  },
]

const STATUS_STYLES = {
  not_started: 'bg-zinc-700 text-zinc-300',
  in_progress: 'bg-blue-500/10 text-blue-400',
  done: 'bg-green-500/10 text-green-400',
}

const STATUS_LABELS = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  done: 'Done',
}

export default function CrewToday() {
  const [assignments, setAssignments] = useState<Array<{
    id: string; project: string; address: string; phase: string; phaseNum: number;
    tasks: { id: string; title: string; done: boolean }[];
    status: 'not_started' | 'in_progress' | 'done';
  }>>(mockAssignments)
  const [clockedIn, setClockedIn] = useState(false)

  const toggleTask = (assignmentId: string, taskId: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id !== assignmentId) return a
      const tasks = a.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
      const allDone = tasks.every(t => t.done)
      const anyDone = tasks.some(t => t.done)
      return { ...a, tasks, status: (allDone ? 'done' : anyDone ? 'in_progress' : 'not_started') as 'not_started' | 'in_progress' | 'done' }
    }))
  }

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <Layout>
      <div className="space-y-6 pb-24 lg:pb-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">{greeting}, Mike 👋</h1>
          <p className="text-zinc-400 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-zinc-700 transition min-h-[80px]">
            <span className="text-2xl">📸</span>
            <span className="text-xs text-zinc-300 font-medium">Upload Photo</span>
          </button>
          <button className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-zinc-700 transition min-h-[80px]">
            <span className="text-2xl">📝</span>
            <span className="text-xs text-zinc-300 font-medium">Material List</span>
          </button>
          <button
            onClick={() => setClockedIn(!clockedIn)}
            className={`rounded-xl p-4 flex flex-col items-center gap-2 transition min-h-[80px] border ${
              clockedIn
                ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                : 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
            }`}
          >
            <span className="text-2xl">⏰</span>
            <span className={`text-xs font-medium ${clockedIn ? 'text-red-400' : 'text-green-400'}`}>
              {clockedIn ? 'Clock Out' : 'Clock In'}
            </span>
          </button>
        </div>

        {/* Today's Assignments */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Today's Assignments</h2>
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link to={`/crew/project/${assignment.id}`} className="text-white font-medium text-base hover:text-blue-400 transition">
                    {assignment.project}
                  </Link>
                  <p className="text-zinc-400 text-sm mt-0.5">{assignment.address}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[assignment.status]}`}>
                  {STATUS_LABELS[assignment.status]}
                </span>
              </div>

              <div className="text-xs text-zinc-500 mb-3">Phase {assignment.phaseNum}: {assignment.phase}</div>

              {/* Tasks */}
              <div className="space-y-3 mb-4">
                {assignment.tasks.map((task) => (
                  <label key={task.id} className="flex items-center gap-3 cursor-pointer min-h-[48px]">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(assignment.id, task.id)}
                      className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${task.done ? 'text-zinc-500 line-through' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                  </label>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(assignment.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg text-sm font-medium hover:bg-blue-500 transition min-h-[48px] flex items-center justify-center"
                >
                  🗺️ Navigate
                </a>
                <button className="flex-1 bg-zinc-800 text-white py-3 rounded-lg text-sm font-medium hover:bg-zinc-700 transition min-h-[48px]">
                  📸 Upload Photo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </Layout>
  )
}
