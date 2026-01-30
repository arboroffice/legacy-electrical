import { useState } from 'react'
import Layout from '../../components/Layout'

type OrderStatus = 'In Transit' | 'Delivered' | 'Processing'

interface LineItem {
  name: string
  qty: string
  cost: string
}

interface MaterialOrder {
  id: string
  project: string
  amount: number
  status: OrderStatus
  date: string
  items: LineItem[]
}

const orders: MaterialOrder[] = [
  {
    id: 'MO-089',
    project: 'Sunrise Heights Lot 12',
    amount: 3200,
    status: 'In Transit',
    date: 'ETA: Jan 22',
    items: [
      { name: '12/2 Romex (250ft)', qty: '8 rolls', cost: '$640' },
      { name: '14/2 Romex (250ft)', qty: '6 rolls', cost: '$420' },
      { name: '200A Main Panel', qty: '1', cost: '$485' },
      { name: '4" Square Boxes', qty: '48', cost: '$192' },
      { name: '6" LED Cans', qty: '32', cost: '$960' },
      { name: 'Misc (connectors, staples, tape)', qty: '—', cost: '$503' },
    ],
  },
  {
    id: 'MO-088',
    project: 'Oak Ridge Lot 7',
    amount: 1850,
    status: 'Delivered',
    date: 'Jan 18',
    items: [
      { name: '12/2 Romex (250ft)', qty: '4 rolls', cost: '$320' },
      { name: '14/3 Romex (250ft)', qty: '3 rolls', cost: '$285' },
      { name: '4" Round Boxes', qty: '36', cost: '$108' },
      { name: '4" LED Cans', qty: '24', cost: '$576' },
      { name: 'Single Gang Old Work Boxes', qty: '20', cost: '$60' },
      { name: 'Misc', qty: '—', cost: '$501' },
    ],
  },
  {
    id: 'MO-087',
    project: '891 Cypress Bend',
    amount: 4500,
    status: 'Processing',
    date: 'ETA: Jan 25',
    items: [
      { name: '10/3 Romex (125ft)', qty: '4 rolls', cost: '$520' },
      { name: '12/2 Romex (250ft)', qty: '10 rolls', cost: '$800' },
      { name: '200A Main Panel', qty: '1', cost: '$485' },
      { name: 'Sub Panel 100A', qty: '1', cost: '$285' },
      { name: '6" LED Cans', qty: '48', cost: '$1,440' },
      { name: 'Weatherproof Boxes + Covers', qty: '8', cost: '$120' },
      { name: 'Misc', qty: '—', cost: '$850' },
    ],
  },
]

const lowStockAlerts = [
  { item: '12/2 Romex (250ft)', onHand: 2, reorderPoint: 5 },
  { item: '200A Main Panels', onHand: 0, reorderPoint: 2 },
  { item: '6" LED Cans', onHand: 8, reorderPoint: 20 },
]

const statusStyle: Record<OrderStatus, string> = {
  'In Transit': 'bg-blue-500/20 text-blue-400',
  Delivered: 'bg-green-500/20 text-green-400',
  Processing: 'bg-yellow-500/20 text-yellow-400',
}

export default function Materials() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const fmt = (n: number) => '$' + n.toLocaleString()

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Materials</h1>
            <p className="text-zinc-400 text-sm mt-1">Track orders and inventory across all projects</p>
          </div>
          <button className="min-h-[44px] px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition">
            Request Material
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Orders', value: '12' },
            { label: 'Pending Delivery', value: '3' },
            { label: 'Budget Used', value: '$24,800 / $35,000' },
          ].map(card => (
            <div key={card.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-zinc-400 text-sm">{card.label}</div>
              <div className="text-2xl font-bold text-white mt-1">{card.value}</div>
            </div>
          ))}
        </div>

        {/* Budget bar */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-400">Budget Utilization</span>
            <span className="text-white font-medium">70.9%</span>
          </div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '70.9%' }} />
          </div>
        </div>

        {/* Active Orders */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Active Orders</h2>
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-blue-400 font-medium">#{order.id}</span>
                      <span className="text-zinc-600 mx-2">•</span>
                      <span className="text-white">{order.project}</span>
                    </div>
                    <span className="text-white font-medium">{fmt(order.amount)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-zinc-400 text-sm">{order.date}</span>
                    <span className="text-zinc-500">{expanded === order.id ? '▲' : '▼'}</span>
                  </div>
                </button>
                {expanded === order.id && (
                  <div className="border-t border-zinc-800 px-5 pb-5">
                    <table className="w-full text-sm mt-3">
                      <thead>
                        <tr className="text-zinc-400 border-b border-zinc-800">
                          <th className="text-left py-2 font-medium">Item</th>
                          <th className="text-left py-2 font-medium">Qty</th>
                          <th className="text-right py-2 font-medium">Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-zinc-800/50">
                            <td className="py-2 text-white">{item.name}</td>
                            <td className="py-2 text-zinc-300">{item.qty}</td>
                            <td className="py-2 text-zinc-300 text-right">{item.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">⚠️ Low Stock Alerts</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="text-left px-5 py-3 font-medium">Item</th>
                  <th className="text-right px-5 py-3 font-medium">On Hand</th>
                  <th className="text-right px-5 py-3 font-medium">Reorder Point</th>
                  <th className="text-right px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockAlerts.map((alert, idx) => (
                  <tr key={idx} className="border-b border-zinc-800/50">
                    <td className="px-5 py-3 text-white">{alert.item}</td>
                    <td className="px-5 py-3 text-right text-red-400 font-medium">{alert.onHand}</td>
                    <td className="px-5 py-3 text-right text-zinc-400">{alert.reorderPoint}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full text-xs font-medium">
                        {alert.onHand === 0 ? 'Out of Stock' : 'Low'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
