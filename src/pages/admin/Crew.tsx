import { useState } from 'react'
import { UserPlus, X } from 'lucide-react'
import Layout from '../../components/Layout'

const MOCK_CREW = [
  { id: '1', name: 'Tyler Menard', role: 'pm' as const, email: 'tyler@legacyelectrical.com', assignments: ['142 Oak Ridge Dr', '891 Cypress Bend', '2200 Magnolia Estates', '567 Pelican Way', '1800 Bayou Park'], hoursWeek: 42, hoursMonth: 168 },
  { id: '2', name: 'Marcus Landry', role: 'crew' as const, email: 'marcus@legacyelectrical.com', assignments: ['142 Oak Ridge Dr', '1800 Bayou Park'], hoursWeek: 38, hoursMonth: 152 },
  { id: '3', name: 'Jake Thibodaux', role: 'crew' as const, email: 'jake@legacyelectrical.com', assignments: ['142 Oak Ridge Dr', '567 Pelican Way'], hoursWeek: 40, hoursMonth: 160 },
  { id: '4', name: 'Beau Fontenot', role: 'crew' as const, email: 'beau@legacyelectrical.com', assignments: ['891 Cypress Bend'], hoursWeek: 36, hoursMonth: 144 },
  { id: '5', name: 'Corey Breaux', role: 'crew' as const, email: 'corey@legacyelectrical.com', assignments: ['567 Pelican Way'], hoursWeek: 34, hoursMonth: 136 },
  { id: '6', name: 'Dylan Richard', role: 'crew' as const, email: 'dylan@legacyelectrical.com', assignments: [], hoursWeek: 0, hoursMonth: 0 },
  { id: '7', name: 'Chase Guillory', role: 'crew' as const, email: 'chase@legacyelectrical.com', assignments: ['330 Heritage Ln'], hoursWeek: 32, hoursMonth: 128 },
  { id: '8', name: 'Trent LeBlanc', role: 'crew' as const, email: 'trent@legacyelectrical.com', assignments: ['2200 Magnolia Estates'], hoursWeek: 28, hoursMonth: 112 },
]

export default function AdminCrew() {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState<'pm' | 'crew'>('crew')

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Crew Management</h1>
            <p className="text-slate-400 text-sm mt-1">{MOCK_CREW.length} team members</p>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <UserPlus className="w-4 h-4" /> Invite Crew Member
          </button>
        </div>

        {/* Invite Modal */}
        {showInvite && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Invite Crew Member</h3>
                <button onClick={() => setShowInvite(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Role</label>
                  <div className="flex gap-2">
                    {(['pm', 'crew'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setInviteRole(r)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          inviteRole === r
                            ? r === 'pm' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-lg text-sm font-medium transition"
                  onClick={() => { setShowInvite(false); setInviteEmail(''); setInviteName('') }}
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Crew Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_CREW.map((member) => (
            <div key={member.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-white font-medium">{member.name}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{member.email}</div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  member.role === 'pm' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-pink-500/20 text-pink-400'
                }`}>
                  {member.role.toUpperCase()}
                </span>
              </div>

              <div className="text-sm text-slate-400 mb-2">Current Assignments</div>
              {member.assignments.length > 0 ? (
                <div className="space-y-1 mb-3">
                  {member.assignments.map((a) => (
                    <div key={a} className="text-xs text-slate-300 bg-slate-800 rounded px-2 py-1">{a}</div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-600 mb-3">No active assignments</p>
              )}

              <div className="flex gap-4 pt-3 border-t border-slate-800">
                <div>
                  <div className="text-xs text-slate-500">This Week</div>
                  <div className="text-sm text-white font-medium">{member.hoursWeek}h</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">This Month</div>
                  <div className="text-sm text-white font-medium">{member.hoursMonth}h</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
