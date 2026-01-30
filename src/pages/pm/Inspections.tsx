import { useState } from 'react'
import Layout from '../../components/Layout'

type InspectionStatus = 'Scheduled' | 'Passed' | 'Failed' | 'Re-inspect'

interface Inspection {
  id: string
  project: string
  address: string
  phase: string
  date: string
  time: string
  inspector: string
  status: InspectionStatus
}

const upcomingInspections: Inspection[] = [
  { id: '1', project: 'Sunrise Heights Lot 12', address: 'Sunrise Heights, Edmond OK', phase: 'Pre Rough Inspection', date: 'Jan 22, 2024', time: '9:00 AM', inspector: 'City of Edmond', status: 'Scheduled' },
  { id: '2', project: 'Oak Ridge Lot 7', address: 'Oak Ridge, Norman OK', phase: 'Rough In Inspection', date: 'Jan 24, 2024', time: '2:00 PM', inspector: 'City of Norman', status: 'Scheduled' },
  { id: '3', project: '891 Cypress Bend', address: '891 Cypress Bend, OKC', phase: 'Service Inspection', date: 'Jan 26, 2024', time: '10:00 AM', inspector: 'OG&E', status: 'Scheduled' },
]

const pastInspections: Inspection[] = [
  { id: '4', project: 'Brookstone Lot 22', address: 'Brookstone, Yukon OK', phase: 'Rough In Inspection', date: 'Jan 15, 2024', time: '10:00 AM', inspector: 'City of Yukon', status: 'Passed' },
  { id: '5', project: '567 Pelican Way', address: '567 Pelican Way, Edmond OK', phase: 'Final Inspection', date: 'Jan 12, 2024', time: '1:00 PM', inspector: 'City of Edmond', status: 'Passed' },
  { id: '6', project: 'Sunrise Heights Lot 8', address: 'Sunrise Heights, Edmond OK', phase: 'Rough In Inspection', date: 'Jan 8, 2024', time: '9:00 AM', inspector: 'City of Edmond', status: 'Failed' },
  { id: '7', project: 'Oak Ridge Lot 3', address: 'Oak Ridge, Norman OK', phase: 'Pre Rough Inspection', date: 'Jan 5, 2024', time: '11:00 AM', inspector: 'City of Norman', status: 'Re-inspect' },
]

const statusBadge = (status: InspectionStatus) => {
  const styles: Record<InspectionStatus, string> = {
    Scheduled: 'bg-blue-500/20 text-blue-400',
    Passed: 'bg-green-500/20 text-green-400',
    Failed: 'bg-red-500/20 text-red-400',
    'Re-inspect': 'bg-yellow-500/20 text-yellow-400',
  }
  const icons: Record<InspectionStatus, string> = {
    Scheduled: '📋',
    Passed: '✅',
    Failed: '❌',
    'Re-inspect': '🔄',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  )
}

type TabFilter = 'All' | 'Pending' | 'Passed' | 'Failed'

export default function Inspections() {
  const [tab, setTab] = useState<TabFilter>('All')
  const [showModal, setShowModal] = useState(false)

  const tabs: TabFilter[] = ['All', 'Pending', 'Passed', 'Failed']

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Inspections</h1>
            <p className="text-zinc-400 text-sm mt-1">Track and manage electrical inspections</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="min-h-[44px] px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition"
          >
            Schedule Inspection
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`min-h-[44px] px-4 rounded-lg text-sm font-medium transition ${
                tab === t ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Upcoming */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Upcoming Inspections</h2>
          <div className="space-y-3">
            {upcomingInspections.filter(() => tab === 'All' || tab === 'Pending').map(insp => (
              <div key={insp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-white font-medium">{insp.project}</div>
                    <div className="text-zinc-400 text-sm">{insp.address}</div>
                    <div className="text-sm text-zinc-300 mt-2">
                      <span className="text-blue-400 font-medium">{insp.phase}</span>
                      <span className="text-zinc-600 mx-2">•</span>
                      {insp.date} at {insp.time}
                    </div>
                    <div className="text-sm text-zinc-400">Inspector: {insp.inspector}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {statusBadge(insp.status)}
                    <div className="flex gap-2 mt-2">
                      <button className="min-h-[44px] px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition">
                        Prep Checklist
                      </button>
                      <button className="min-h-[44px] px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition">
                        Upload Results
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Past Inspections</h2>
          <div className="space-y-3">
            {pastInspections.filter(i =>
              tab === 'All' ||
              (tab === 'Passed' && i.status === 'Passed') ||
              (tab === 'Failed' && i.status === 'Failed') ||
              (tab === 'Pending' && i.status === 'Re-inspect')
            ).map(insp => (
              <div key={insp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-white font-medium">{insp.project}</div>
                    <div className="text-zinc-400 text-sm">{insp.address}</div>
                    <div className="text-sm text-zinc-300 mt-2">
                      <span className="text-blue-400 font-medium">{insp.phase}</span>
                      <span className="text-zinc-600 mx-2">•</span>
                      {insp.date} at {insp.time}
                    </div>
                    <div className="text-sm text-zinc-400">Inspector: {insp.inspector}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {statusBadge(insp.status)}
                    <div className="flex gap-2 mt-2">
                      <button className="min-h-[44px] px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition">
                        Prep Checklist
                      </button>
                      <button className="min-h-[44px] px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition">
                        Upload Results
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Schedule Inspection</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Project</label>
                <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm">
                  <option>Sunrise Heights Lot 12</option>
                  <option>Oak Ridge Lot 7</option>
                  <option>891 Cypress Bend</option>
                  <option>Brookstone Lot 22</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Phase</label>
                <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm">
                  <option>Pre Rough Inspection</option>
                  <option>Rough In Inspection</option>
                  <option>Service Inspection</option>
                  <option>Final Inspection</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Date &amp; Time</label>
                <input type="datetime-local" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Inspector / Jurisdiction</label>
                <input type="text" placeholder="e.g. City of Edmond" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-zinc-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="min-h-[44px] flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium transition">Cancel</button>
                <button onClick={() => setShowModal(false)} className="min-h-[44px] flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition">Schedule</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
