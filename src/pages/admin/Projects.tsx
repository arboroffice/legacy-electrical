import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, ArrowUpDown } from 'lucide-react'
import Layout from '../../components/Layout'
import { PROJECT_PHASES } from '../../types'

const MOCK_PROJECTS = [
  { id: '1', name: '142 Oak Ridge Dr', address: '142 Oak Ridge Dr, Sulphur, LA', builder_name: 'Acadiana Homes', contract_amount: 28500, current_phase: 3, status: 'active' as const, created_at: '2025-01-10' },
  { id: '2', name: '891 Cypress Bend', address: '891 Cypress Bend, Lake Charles, LA', builder_name: 'Cameron Builders', contract_amount: 42000, current_phase: 4, status: 'active' as const, created_at: '2024-12-05' },
  { id: '3', name: '2200 Magnolia Estates', address: '2200 Magnolia Estates, Sulphur, LA', builder_name: 'Legacy Homes LLC', contract_amount: 35750, current_phase: 1, status: 'active' as const, created_at: '2025-01-25' },
  { id: '4', name: '567 Pelican Way', address: '567 Pelican Way, DeQuincy, LA', builder_name: 'Gulf Coast Dev', contract_amount: 52000, current_phase: 5, status: 'active' as const, created_at: '2024-11-15' },
  { id: '5', name: '1800 Bayou Park', address: '1800 Bayou Park, Westlake, LA', builder_name: 'Acadiana Homes', contract_amount: 31200, current_phase: 2, status: 'active' as const, created_at: '2025-01-18' },
  { id: '6', name: '330 Heritage Ln', address: '330 Heritage Ln, Sulphur, LA', builder_name: 'Cameron Builders', contract_amount: 29800, current_phase: 6, status: 'active' as const, created_at: '2024-10-20' },
  { id: '7', name: '4400 Lakeside Blvd', address: '4400 Lakeside Blvd, Lake Charles, LA', builder_name: 'Acadiana Homes', contract_amount: 47500, current_phase: 6, status: 'complete' as const, created_at: '2024-08-01' },
]

const phaseColors: Record<number, string> = {
  1: 'bg-blue-500/20 text-blue-400',
  2: 'bg-orange-500/20 text-orange-400',
  3: 'bg-yellow-500/20 text-yellow-400',
  4: 'bg-blue-500/20 text-blue-400',
  5: 'bg-green-500/20 text-green-400',
  6: 'bg-emerald-500/20 text-emerald-400',
}

type SortKey = 'phase' | 'builder' | 'amount' | 'date'

export default function AdminProjects() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('phase')

  const filtered = useMemo(() => {
    let list = MOCK_PROJECTS.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.builder_name.toLowerCase().includes(search.toLowerCase()) ||
        p.address.toLowerCase().includes(search.toLowerCase())
    )
    list.sort((a, b) => {
      switch (sortBy) {
        case 'phase': return a.current_phase - b.current_phase
        case 'builder': return a.builder_name.localeCompare(b.builder_name)
        case 'amount': return b.contract_amount - a.contract_amount
        case 'date': return b.created_at.localeCompare(a.created_at)
        default: return 0
      }
    })
    return list
  }, [search, sortBy])

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-zinc-400 text-sm mt-1">{MOCK_PROJECTS.length} total projects</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search projects, builders, addresses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-zinc-500" />
            {(['phase', 'builder', 'amount', 'date'] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition ${
                  sortBy === key ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">Project</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium hidden md:table-cell">Address</th>
                  <th className="text-left px-4 py-3 text-zinc-400 font-medium">Builder</th>
                  <th className="text-right px-4 py-3 text-zinc-400 font-medium">Contract</th>
                  <th className="text-center px-4 py-3 text-zinc-400 font-medium">Phase</th>
                  <th className="text-center px-4 py-3 text-zinc-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((p) => {
                  const phase = PROJECT_PHASES.find((ph) => ph.number === p.current_phase)
                  return (
                    <tr
                      key={p.id}
                      onClick={() => navigate(`/admin/projects/${p.id}`)}
                      className="hover:bg-zinc-800/50 cursor-pointer transition"
                    >
                      <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-zinc-400 hidden md:table-cell">{p.address}</td>
                      <td className="px-4 py-3 text-zinc-300">{p.builder_name}</td>
                      <td className="px-4 py-3 text-right text-zinc-300">${p.contract_amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${phaseColors[p.current_phase] || 'bg-zinc-700 text-zinc-300'}`}>
                          {phase?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          p.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                          p.status === 'complete' ? 'bg-zinc-700 text-zinc-300' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
