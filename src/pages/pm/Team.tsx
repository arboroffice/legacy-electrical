import { useState } from 'react'
import { Send, X, Mail, Phone, Bell } from 'lucide-react'
import Layout from '../../components/Layout'

type Role = 'crew' | 'sub_crew_lead'

interface CrewMember {
  id: string
  name: string
  role: Role
  email: string
  phone: string
  notifications: { email: boolean; sms: boolean; push: boolean }
  assignments: string[]
  hoursWeek: number
  hoursMonth: number
  available: boolean
}

const ROLE_COLORS: Record<Role, string> = {
  sub_crew_lead: 'bg-blue-500/20 text-blue-400',
  crew: 'bg-pink-500/20 text-pink-400',
}

const CREW: CrewMember[] = [
  { id: '3', name: 'Mario Herrera', role: 'sub_crew_lead', email: 'mario@legacyelectrical.com', phone: '(337) 555-0102', notifications: { email: true, sms: true, push: true }, assignments: ['142 Oak Ridge Dr', '567 Pelican Way'], hoursWeek: 40, hoursMonth: 160, available: false },
  { id: '4', name: 'Marcus Landry', role: 'crew', email: 'marcus@legacyelectrical.com', phone: '(337) 555-0103', notifications: { email: true, sms: false, push: false }, assignments: ['142 Oak Ridge Dr'], hoursWeek: 38, hoursMonth: 152, available: true },
  { id: '5', name: 'Jake Thibodaux', role: 'crew', email: 'jake@legacyelectrical.com', phone: '(337) 555-0104', notifications: { email: true, sms: true, push: false }, assignments: ['567 Pelican Way'], hoursWeek: 40, hoursMonth: 160, available: false },
]

export default function PMTeam() {
  const [notifyTarget, setNotifyTarget] = useState<CrewMember | null>(null)
  const [notifyVia, setNotifyVia] = useState<'email' | 'sms' | 'both'>('sms')
  const [notifyMsg, setNotifyMsg] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const sendNotification = () => {
    if (!notifyTarget) return
    const via = notifyVia === 'both' ? 'Email + SMS' : notifyVia === 'email' ? 'Email' : 'SMS'
    showToast(`Notification sent to ${notifyTarget.name} via ${via}`)
    setNotifyTarget(null)
    setNotifyMsg('')
  }

  return (
    <Layout>
      <div className="space-y-6">
        {toast && (
          <div className="fixed top-4 right-4 z-[60] bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-pulse">
            {toast}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your crew members</p>
        </div>

        {/* Notify Modal */}
        {notifyTarget && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setNotifyTarget(null)}>
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Send Notification</h3>
                <button onClick={() => setNotifyTarget(null)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">To</label>
                  <div className="text-white text-sm bg-zinc-800 rounded-lg px-3 py-2">{notifyTarget.name}</div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Via</label>
                  <div className="flex gap-2">
                    {(['email', 'sms', 'both'] as const).map(v => (
                      <button key={v} onClick={() => setNotifyVia(v)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${notifyVia === v ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                        {v === 'both' ? 'Both' : v.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Message</label>
                  <textarea value={notifyMsg} onChange={e => setNotifyMsg(e.target.value)} rows={3}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="Type your message..." />
                </div>
                <button onClick={sendNotification} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium transition">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Crew Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CREW.map(member => (
            <div key={member.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full bg-green-400`} />
                  <div>
                    <div className="text-white font-medium">{member.name}</div>
                    <div className="text-zinc-500 text-xs mt-0.5">{member.email}</div>
                    <div className="text-zinc-500 text-xs">{member.phone}</div>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_COLORS[member.role]}`}>
                  {member.role === 'sub_crew_lead' ? 'SUB CREW LEAD' : 'CREW'}
                </span>
              </div>

              <div className="flex gap-2 mb-3">
                <Mail className={`w-4 h-4 ${member.notifications.email ? 'text-blue-400' : 'text-zinc-600'}`} />
                <Phone className={`w-4 h-4 ${member.notifications.sms ? 'text-blue-400' : 'text-zinc-600'}`} />
                <Bell className={`w-4 h-4 ${member.notifications.push ? 'text-blue-400' : 'text-zinc-600'}`} />
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${member.available ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {member.available ? 'Available' : 'Assigned'}
                </span>
              </div>

              <div className="text-sm text-zinc-400 mb-2">Assignments</div>
              {member.assignments.length > 0 ? (
                <div className="space-y-1 mb-3">
                  {member.assignments.map(a => (
                    <div key={a} className="text-xs text-zinc-300 bg-zinc-800 rounded px-2 py-1">{a}</div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-600 mb-3">No active assignments</p>
              )}

              <div className="flex gap-4 pt-3 border-t border-zinc-800">
                <div>
                  <div className="text-xs text-zinc-500">This Week</div>
                  <div className="text-sm text-white font-medium">{member.hoursWeek}h</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">This Month</div>
                  <div className="text-sm text-white font-medium">{member.hoursMonth}h</div>
                </div>
                <button onClick={() => setNotifyTarget(member)} className="ml-auto flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition">
                  <Send className="w-3.5 h-3.5" /> Notify
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
