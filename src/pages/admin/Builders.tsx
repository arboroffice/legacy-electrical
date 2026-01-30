import { useState } from 'react'
import { Search, Plus, X, Phone, Mail, MapPin } from 'lucide-react'
import Layout from '../../components/Layout'

interface Builder {
  id: string
  name: string
  contact: string
  phone: string
  email: string
  address: string
  activeProjects: number
  revenueYTD: number
  avgPaymentDays: number
  rating: number
  onTimePercent: number
  projects: string[]
  totalRevenue: number
}

const BUILDERS: Builder[] = [
  { id: '1', name: 'Homes by Taber', contact: 'John Taber', phone: '(405) 555-0201', email: 'john@homesbytaber.com', address: '1200 Builder Ave, OKC, OK', activeProjects: 12, revenueYTD: 485000, avgPaymentDays: 18, rating: 5, onTimePercent: 96, projects: ['142 Oak Ridge Dr', '891 Cypress Bend', '2200 Magnolia Estates', '567 Pelican Way', '1800 Bayou Park', '330 Heritage Ln', '450 Sunrise Ct', '780 Willow Creek', '920 Pecan Grove', '1100 Elm St', '1350 Cedar Ln', '1600 Maple Dr'], totalRevenue: 1240000 },
  { id: '2', name: 'Acadiana Homes', contact: 'Marie Dupuis', phone: '(337) 555-0302', email: 'marie@acadianahomes.com', address: '800 Lafayette Rd, Lafayette, LA', activeProjects: 8, revenueYTD: 312000, avgPaymentDays: 24, rating: 4, onTimePercent: 88, projects: ['210 Vermilion St', '445 Evangeline Dr', '670 Cajun Way', '890 Bayou Blvd', '1120 Plantation Ct', '1340 Acadian Ln', '1560 Iberia Ave', '1780 Breaux Dr'], totalRevenue: 890000 },
  { id: '3', name: 'Cameron Builders', contact: 'Rick Cameron', phone: '(405) 555-0403', email: 'rick@cameronbuilders.com', address: '3400 Construction Blvd, Edmond, OK', activeProjects: 6, revenueYTD: 198000, avgPaymentDays: 32, rating: 3, onTimePercent: 75, projects: ['520 Stone Creek', '740 Prairie View', '960 Ridgewood Dr', '1180 Timber Trail', '1400 Meadow Ln', '1620 Summit Way'], totalRevenue: 620000 },
  { id: '4', name: 'Legacy Homes LLC', contact: 'Sarah Mitchell', phone: '(405) 555-0504', email: 'sarah@legacyhomesllc.com', address: '5600 Legacy Dr, Norman, OK', activeProjects: 4, revenueYTD: 156000, avgPaymentDays: 15, rating: 5, onTimePercent: 98, projects: ['310 Heritage Ct', '530 Tradition Way', '750 Foundation Dr', '970 Cornerstone Blvd'], totalRevenue: 480000 },
  { id: '5', name: 'Shaw Construction', contact: 'Dan Shaw', phone: '(405) 555-0605', email: 'dan@shawconstruction.com', address: '7800 Industrial Pkwy, Midwest City, OK', activeProjects: 3, revenueYTD: 94000, avgPaymentDays: 45, rating: 2, onTimePercent: 62, projects: ['120 Eastside Dr', '340 Commerce St', '560 Factory Rd'], totalRevenue: 280000 },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400">
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

function fmt(n: number) {
  return n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`
}

export default function AdminBuilders() {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const filtered = BUILDERS.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Builders</h1>
            <p className="text-zinc-400 text-sm mt-1">{BUILDERS.length} builder relationships</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Plus size={16} /> Add Builder
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search builders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Builder Cards */}
        <div className="grid gap-4">
          {filtered.map(builder => (
            <div key={builder.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === builder.id ? null : builder.id)}
                className="w-full p-5 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{builder.name}</h3>
                    <div className="mt-1"><StarRating rating={builder.rating} /></div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-white font-bold">{builder.activeProjects}</div>
                      <div className="text-zinc-500">Active Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold">{fmt(builder.revenueYTD)}</div>
                      <div className="text-zinc-500">Revenue YTD</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${builder.avgPaymentDays <= 20 ? 'text-green-400' : builder.avgPaymentDays <= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {builder.avgPaymentDays} days
                      </div>
                      <div className="text-zinc-500">Avg Payment</div>
                    </div>
                  </div>
                </div>
              </button>

              {expanded === builder.id && (
                <div className="border-t border-zinc-800 p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Contact */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Contact</h4>
                      <p className="text-white text-sm">{builder.contact}</p>
                      <p className="text-zinc-400 text-sm flex items-center gap-2"><Phone size={14} /> {builder.phone}</p>
                      <p className="text-zinc-400 text-sm flex items-center gap-2"><Mail size={14} /> {builder.email}</p>
                      <p className="text-zinc-400 text-sm flex items-center gap-2"><MapPin size={14} /> {builder.address}</p>
                    </div>
                    {/* Payment History */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Payment History</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-400">On-time:</span>
                        <span className={`text-sm font-bold ${builder.onTimePercent >= 90 ? 'text-green-400' : builder.onTimePercent >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>{builder.onTimePercent}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-400">Avg days to pay:</span>
                        <span className="text-sm text-white font-bold">{builder.avgPaymentDays}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-400">Total revenue:</span>
                        <span className="text-sm text-white font-bold">${(builder.totalRevenue / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                    {/* Active Projects */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Active Projects</h4>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {builder.projects.map(p => (
                          <div key={p} className="text-sm text-zinc-300 bg-zinc-800 px-2 py-1 rounded">{p}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Builder Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Add Builder</h2>
              <button onClick={() => setShowAdd(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
            </div>
            <input placeholder="Company Name" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-blue-500" />
            <input placeholder="Contact Name" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-blue-500" />
            <input placeholder="Phone" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-blue-500" />
            <input placeholder="Email" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-blue-500" />
            <button onClick={() => setShowAdd(false)} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium transition">
              Add Builder
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}
