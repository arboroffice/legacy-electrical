import { useAuth } from '../../hooks/useAuth'
import Layout from '../../components/Layout'
import BottomNav from '../../components/BottomNav'

const stats = [
  { label: 'Hours this week', value: '32.5' },
  { label: 'Hours this month', value: '142' },
  { label: 'Jobs completed', value: '8' },
  { label: 'On-time rate', value: '96%' },
]

const certs = [
  { name: 'Journeyman License #JE-2024-0847', status: 'Active', color: 'text-green-400 bg-green-500/10' },
  { name: 'OSHA 30', status: 'Valid thru Dec 2026', color: 'text-blue-400 bg-blue-500/10' },
  { name: 'First Aid/CPR', status: 'Valid thru Jun 2026', color: 'text-blue-400 bg-blue-500/10' },
]

const recentActivity = [
  { emoji: '⏰', text: 'Clocked in at Oak Ridge Lot 7', time: 'Today, 7:02 AM' },
  { emoji: '✅', text: 'Completed "Install conduit runs"', time: 'Yesterday, 3:45 PM' },
  { emoji: '📸', text: 'Uploaded photo — Panel rough-in', time: 'Yesterday, 2:10 PM' },
  { emoji: '📝', text: 'Submitted material list', time: 'Jan 14, 11:30 AM' },
  { emoji: '⏰', text: 'Clocked out at Sunrise Heights', time: 'Jan 14, 4:58 PM' },
]

export default function CrewProfile() {
  const { signOut } = useAuth()

  return (
    <Layout>
      <div className="space-y-6 pb-24 lg:pb-6">
        {/* Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">👷</div>
          <h1 className="text-xl font-bold text-white">Mike Rodriguez</h1>
          <p className="text-blue-400 text-sm font-medium">Journeyman Electrician</p>
          <p className="text-zinc-400 text-sm mt-1">📞 (405) 555-0187</p>
          <p className="text-zinc-500 text-sm">Team Alpha</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-zinc-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-3">📜 Certifications</h2>
          <div className="space-y-3">
            {certs.map(c => (
              <div key={c.name} className="flex items-center justify-between">
                <p className="text-slate-200 text-sm">{c.name}</p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.color}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-3">📊 Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg">{a.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm">{a.text}</p>
                  <p className="text-zinc-500 text-xs">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={signOut}
          className="w-full bg-zinc-900 border border-red-500/30 text-red-400 py-4 rounded-xl font-medium hover:bg-red-500/10 transition min-h-[48px]"
        >
          Sign Out
        </button>
      </div>
      <BottomNav />
    </Layout>
  )
}
