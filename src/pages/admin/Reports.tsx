import { Download } from 'lucide-react'
import Layout from '../../components/Layout'

const builderRevenue = [
  { name: 'Homes by Taber', amount: 485000 },
  { name: 'Acadiana Homes', amount: 312000 },
  { name: 'Cameron Builders', amount: 198000 },
  { name: 'Legacy Homes', amount: 156000 },
  { name: 'Shaw Construction', amount: 94000 },
]

const crewPerformance = [
  { name: 'Mike Rodriguez', role: 'Journeyman', hours: 142, jobs: 8, onTime: 96 },
  { name: 'James Wilson', role: 'Journeyman', hours: 138, jobs: 7, onTime: 92 },
  { name: 'Carlos Mendez', role: 'Apprentice', hours: 160, jobs: 10, onTime: 88 },
  { name: 'Tyler Brooks', role: 'Apprentice', hours: 148, jobs: 9, onTime: 94 },
]

const monthlyRevenue = [
  { month: 'Oct', amount: 185000 },
  { month: 'Nov', amount: 210000 },
  { month: 'Dec', amount: 165000 },
  { month: 'Jan', amount: 195000 },
  { month: 'Feb', amount: 240000 },
  { month: 'Mar', amount: 250000 },
]

const maxRevenue = Math.max(...builderRevenue.map(b => b.amount))
const maxMonthly = Math.max(...monthlyRevenue.map(m => m.amount))

function ExportButton() {
  return (
    <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-400 transition">
      <Download size={14} /> Export
    </button>
  )
}

function fmt(n: number) {
  return `$${Math.round(n / 1000)}K`
}

export default function AdminReports() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-zinc-400 text-sm mt-1">Analytics & performance metrics</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Revenue by Builder */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Revenue by Builder</h2>
              <ExportButton />
            </div>
            <div className="space-y-3">
              {builderRevenue.map(b => (
                <div key={b.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-300">{b.name}</span>
                    <span className="text-white font-medium">{fmt(b.amount)}</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all"
                      style={{ width: `${(b.amount / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Phase */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Revenue by Phase</h2>
              <ExportButton />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-300">65% Invoices (Rough-in)</span>
                  <span className="text-white font-medium">$812K</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-300">35% Invoices (Trim-out)</span>
                  <span className="text-white font-medium">$437K</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-3">
                  <div className="bg-blue-400 h-3 rounded-full" style={{ width: '54%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-300">Change Orders</span>
                  <span className="text-white font-medium">$62K</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-3">
                  <div className="bg-blue-300 h-3 rounded-full" style={{ width: '8%' }} />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between text-sm">
              <span className="text-zinc-400">Total Revenue</span>
              <span className="text-white font-bold">$1,311K</span>
            </div>
          </div>

          {/* Crew Performance */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Crew Performance</h2>
              <ExportButton />
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-500 text-left">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium text-right">Hrs/Mo</th>
                  <th className="pb-3 font-medium text-right">Jobs</th>
                  <th className="pb-3 font-medium text-right">On-Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {crewPerformance.map(c => (
                  <tr key={c.name}>
                    <td className="py-3 text-white">{c.name}</td>
                    <td className="py-3 text-zinc-400">{c.role}</td>
                    <td className="py-3 text-white text-right">{c.hours}</td>
                    <td className="py-3 text-white text-right">{c.jobs}</td>
                    <td className="py-3 text-right">
                      <span className={`font-medium ${c.onTime >= 95 ? 'text-green-400' : c.onTime >= 90 ? 'text-yellow-400' : 'text-orange-400'}`}>
                        {c.onTime}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inspection Pass Rate */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Inspection Pass Rate</h2>
              <ExportButton />
            </div>
            <div className="flex items-center justify-center py-6">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#27272a" strokeWidth="10" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#3b82f6" strokeWidth="10" strokeDasharray={`${2 * Math.PI * 52 * 0.94} ${2 * Math.PI * 52 * 0.06}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">94%</span>
                  <span className="text-xs text-zinc-500">First-Time Pass</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Monthly Revenue Trend</h2>
            <ExportButton />
          </div>
          <div className="flex items-end gap-4 h-48">
            {monthlyRevenue.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-zinc-400">{fmt(m.amount)}</span>
                <div
                  className="w-full bg-blue-500 rounded-t-lg transition-all"
                  style={{ height: `${(m.amount / maxMonthly) * 160}px` }}
                />
                <span className="text-xs text-zinc-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
