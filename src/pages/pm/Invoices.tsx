import { useState } from 'react'
import Layout from '../../components/Layout'

type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue'

interface Invoice {
  number: string
  project: string
  builder: string
  phase: string
  amount: number
  status: InvoiceStatus
  date: string
}

const invoices: Invoice[] = [
  { number: 'INV-2024-041', project: 'Sunrise Heights Lot 12', builder: 'Homes by Taber', phase: '65% Rough', amount: 9425, status: 'Sent', date: 'Jan 15' },
  { number: 'INV-2024-040', project: '567 Pelican Way', builder: 'Legacy Homes', phase: '35% Final', amount: 5075, status: 'Paid', date: 'Jan 10' },
  { number: 'INV-2024-039', project: 'Oak Ridge Lot 7', builder: 'Acadiana Homes', phase: '65% Rough', amount: 18525, status: 'Overdue', date: 'Dec 28' },
  { number: 'INV-2024-038', project: 'Brookstone Lot 22', builder: 'Cameron Builders', phase: '65% Rough', amount: 14950, status: 'Paid', date: 'Dec 20' },
  { number: 'INV-2024-037', project: '891 Cypress Bend', builder: 'Cameron Builders', phase: '35% Final', amount: 14700, status: 'Sent', date: 'Jan 18' },
]

const statusStyle: Record<InvoiceStatus, string> = {
  Draft: 'bg-zinc-700/50 text-zinc-300',
  Sent: 'bg-blue-500/20 text-blue-400',
  Paid: 'bg-green-500/20 text-green-400',
  Overdue: 'bg-red-500/20 text-red-400',
}

type TabFilter = 'All' | 'Draft' | 'Sent' | 'Paid' | 'Overdue'

export default function Invoices() {
  const [tab, setTab] = useState<TabFilter>('All')
  const filtered = tab === 'All' ? invoices : invoices.filter(i => i.status === tab)
  const tabs: TabFilter[] = ['All', 'Draft', 'Sent', 'Paid', 'Overdue']

  const fmt = (n: number) => '$' + n.toLocaleString()

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Invoices</h1>
            <p className="text-zinc-400 text-sm mt-1">65/35 invoicing — 65% at rough-in, 35% at trim/final</p>
          </div>
          <button className="min-h-[44px] px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition">
            Create Invoice
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Outstanding', value: '$48,200', color: 'text-white' },
            { label: 'Collected This Month', value: '$62,400', color: 'text-green-400' },
            { label: 'Overdue (30+ days)', value: '$8,500', color: 'text-red-400' },
          ].map(card => (
            <div key={card.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-zinc-400 text-sm">{card.label}</div>
              <div className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</div>
            </div>
          ))}
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

        {/* Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="text-left px-5 py-3 font-medium">Invoice #</th>
                <th className="text-left px-5 py-3 font-medium">Project</th>
                <th className="text-left px-5 py-3 font-medium">Builder</th>
                <th className="text-left px-5 py-3 font-medium">Phase</th>
                <th className="text-right px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.number} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                  <td className="px-5 py-4 text-blue-400 font-medium">{inv.number}</td>
                  <td className="px-5 py-4 text-white">{inv.project}</td>
                  <td className="px-5 py-4 text-zinc-300">{inv.builder}</td>
                  <td className="px-5 py-4 text-zinc-300">{inv.phase}</td>
                  <td className="px-5 py-4 text-white text-right font-medium">{fmt(inv.amount)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
