import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import BottomNav from '../../components/BottomNav'
import { PROJECT_PHASES } from '../../types'

type JobStatus = 'not_started' | 'in_progress' | 'complete'

interface Job {
  id: string
  project: string
  address: string
  builder: string
  currentPhase: number
  status: JobStatus
}

const mockJobs: Job[] = [
  { id: '1', project: 'Sunrise Heights Lot 12', address: '1234 Sunrise Blvd, Edmond OK', builder: 'Homes by Taber', currentPhase: 3, status: 'in_progress' },
  { id: '2', project: 'Oak Ridge Lot 7', address: '890 Oak Ridge Dr, Norman OK', builder: 'Ideal Homes', currentPhase: 4, status: 'in_progress' },
  { id: '3', project: 'Prairie Wind Lot 3', address: '456 Prairie Wind Ave, Yukon OK', builder: 'Homes by Taber', currentPhase: 6, status: 'complete' },
  { id: '4', project: 'Cedar Park Lot 19', address: '2100 Cedar Park Ln, Mustang OK', builder: 'Shaw Homes', currentPhase: 1, status: 'not_started' },
  { id: '5', project: 'Brookstone Lot 11', address: '777 Brookstone Dr, Moore OK', builder: 'Simmons Homes', currentPhase: 5, status: 'in_progress' },
]

const STATUS_STYLES: Record<JobStatus, string> = {
  not_started: 'bg-zinc-700 text-zinc-300',
  in_progress: 'bg-blue-500/10 text-blue-400',
  complete: 'bg-green-500/10 text-green-400',
}

const STATUS_LABELS: Record<JobStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  complete: 'Complete',
}

type Filter = 'all' | 'active' | 'completed'

export default function CrewJobs() {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = mockJobs.filter(j => {
    if (filter === 'active') return j.status !== 'complete'
    if (filter === 'completed') return j.status === 'complete'
    return true
  })

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ]

  return (
    <Layout>
      <div className="space-y-6 pb-24 lg:pb-6">
        <h1 className="text-2xl font-bold text-white">My Jobs</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition min-h-[48px] ${
                filter === f.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {filtered.map(job => {
            const phase = PROJECT_PHASES.find(p => p.number === job.currentPhase)!
            return (
              <Link
                key={job.id}
                to={`/crew/project/${job.id}`}
                className="block bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white font-medium">{job.project}</p>
                    <p className="text-zinc-400 text-sm">{job.address}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${STATUS_STYLES[job.status]}`}>
                    {STATUS_LABELS[job.status]}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm mb-3">🏠 {job.builder}</p>

                {/* Phase Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-xs">Phase {phase.number}: {phase.name}</span>
                    <span className="text-zinc-500 text-xs">{phase.number}/{PROJECT_PHASES.length}</span>
                  </div>
                  <div className="flex gap-1">
                    {PROJECT_PHASES.map(p => (
                      <div
                        key={p.number}
                        className={`h-2 flex-1 rounded-full ${
                          p.number <= job.currentPhase ? 'bg-blue-500' : 'bg-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <BottomNav />
    </Layout>
  )
}
