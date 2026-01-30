import Layout from '../../components/Layout'
import { AlertTriangle } from 'lucide-react'

const MONTHLY_REVENUE = [
  { month: 'Aug', amount: 47500 },
  { month: 'Sep', amount: 32000 },
  { month: 'Oct', amount: 29800 },
  { month: 'Nov', amount: 52000 },
  { month: 'Dec', amount: 42000 },
  { month: 'Jan', amount: 66250 },
]

const maxRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.amount))

const INVOICES = [
  { id: 1, project: '891 Cypress Bend', builder: 'Cameron Builders', amount: 27300, type: '65%', status: 'paid' as const, due: '2025-01-10' },
  { id: 2, project: '142 Oak Ridge Dr', builder: 'Acadiana Homes', amount: 18525, type: '65%', status: 'sent' as const, due: '2025-01-28' },
  { id: 3, project: '567 Pelican Way', builder: 'Gulf Coast Dev', amount: 33800, type: '65%', status: 'paid' as const, due: '2025-01-05' },
  { id: 4, project: '567 Pelican Way', builder: 'Gulf Coast Dev', amount: 18200, type: '35%', status: 'overdue' as const, due: '2025-01-20' },
  { id: 5, project: '1800 Bayou Park', builder: 'Acadiana Homes', amount: 20280, type: '65%', status: 'draft' as const, due: '' },
  { id: 6, project: '330 Heritage Ln', builder: 'Cameron Builders', amount: 19370, type: '65%', status: 'paid' as const, due: '2024-12-15' },
]

const BUILDER_REVENUE = [
  { builder: 'Acadiana Homes', total: 59700, projects: 2 },
  { builder: 'Cameron Builders', total: 71800, projects: 2 },
  { builder: 'Gulf Coast Dev', total: 52000, projects: 1 },
  { builder: 'Legacy Homes LLC', total: 35750, projects: 1 },
]

const statusStyles: Record<string, string> = {
  paid: 'bg-emerald-500/20 text-emerald-400',
  sent: 'bg-blue-500/20 text-blue-400',
  viewed: 'bg-blue-500/20 text-blue-400',
  draft: 'bg-zinc-700 text-zinc-400',
  overdue: 'bg-red-500/20 text-red-400',
}

export default function AdminFinancials() {
  const totalCollected = INVOICES.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const totalOutstanding = INVOICES.filter((i) => i.status !== 'paid' && i.status !== 'draft').reduce((s, i) => s + i.amount, 0)
  const totalOverdue = INVOICES.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0)

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Financials</h1>
          <p className="text-zinc-400 text-sm mt-1">Revenue tracking and invoices</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="text-zinc-400 text-sm mb-1">Total Collected</div>
            <div className="text-2xl font-bold text-emerald-400">${totalCollected.toLocaleString()}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="text-zinc-400 text-sm mb-1">Outstanding</div>
            <div className="text-2xl font-bold text-blue-400">${totalOutstanding.toLocaleString()}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="text-zinc-400 text-sm mb-1">Overdue</div>
            <div className="text-2xl font-bold text-red-400">${totalOverdue.toLocaleString()}</div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Monthly Revenue</h2>
          <div className="flex items-end gap-3 h-48">
            {MONTHLY_REVENUE.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-zinc-400">${(m.amount / 1000).toFixed(0)}k</span>
                <div className="w-full bg-zinc-800 rounded-t-md overflow-hidden" style={{ height: '100%' }}>
                  <div
                    className="w-full bg-blue-500 rounded-t-md transition-all"
                    style={{ height: `${(m.amount / maxRevenue) * 100}%`, marginTop: 'auto' }}
                  />
                </div>
                <span className="text-xs text-zinc-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoices */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-white mb-3">Invoices</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-4 py-3 text-zinc-400 font-medium">Project</th>
                    <th className="text-left px-4 py-3 text-zinc-400 font-medium hidden sm:table-cell">Builder</th>
                    <th className="text-center px-4 py-3 text-zinc-400 font-medium">Type</th>
                    <th className="text-right px-4 py-3 text-zinc-400 font-medium">Amount</th>
                    <th className="text-center px-4 py-3 text-zinc-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {INVOICES.map((inv) => (
                    <tr key={inv.id} className={`${inv.status === 'overdue' ? 'bg-red-500/5' : ''}`}>
                      <td className="px-4 py-3 text-white flex items-center gap-2">
                        {inv.status === 'overdue' && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                        {inv.project}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell">{inv.builder}</td>
                      <td className="px-4 py-3 text-center text-zinc-300">{inv.type}</td>
                      <td className="px-4 py-3 text-right text-white">${inv.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[inv.status]}`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Builder Breakdown */}
          <div>
            <h2 className="text-sm font-semibold text-white mb-3">Revenue by Builder</h2>
            <div className="space-y-3">
              {BUILDER_REVENUE.map((b) => (
                <div key={b.builder} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white font-medium">{b.builder}</span>
                    <span className="text-sm text-blue-400">${b.total.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5">
                    <div className="bg-blue-500 rounded-full h-1.5" style={{ width: `${(b.total / 80000) * 100}%` }} />
                  </div>
                  <span className="text-xs text-zinc-500 mt-1 block">{b.projects} project(s)</span>
                </div>
              ))}
            </div>

            {/* 65/35 Tracking */}
            <h2 className="text-sm font-semibold text-white mb-3 mt-6">Collection Split</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">65% Draws</span>
                  <span className="text-emerald-400">$98,995</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className="bg-emerald-500 rounded-full h-2" style={{ width: '72%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">35% Draws</span>
                  <span className="text-blue-400">$18,200</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className="bg-blue-500 rounded-full h-2" style={{ width: '34%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
