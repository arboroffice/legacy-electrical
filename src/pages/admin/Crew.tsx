import { useState } from 'react'
import { UserPlus, X, Mail, Phone, Bell, Edit2, UserX, Send, ToggleLeft, ToggleRight } from 'lucide-react'
import Layout from '../../components/Layout'

type Role = 'admin' | 'pm' | 'crew' | 'sub_crew_lead'
type Status = 'active' | 'invited' | 'inactive'

interface NotifPrefs {
  email: boolean
  sms: boolean
  push: boolean
}

interface CrewMember {
  id: string
  name: string
  role: Role
  email: string
  phone: string
  status: Status
  notifications: NotifPrefs
  assignments: string[]
  hoursWeek: number
  hoursMonth: number
}

const ROLE_LABELS: Record<Role, string> = { admin: 'ADMIN', pm: 'PM', crew: 'CREW', sub_crew_lead: 'SUB CREW LEAD' }
const ROLE_COLORS: Record<Role, string> = {
  admin: 'bg-red-500/20 text-red-400',
  pm: 'bg-yellow-500/20 text-yellow-400',
  sub_crew_lead: 'bg-blue-500/20 text-blue-400',
  crew: 'bg-pink-500/20 text-pink-400',
}
const STATUS_COLORS: Record<Status, string> = { active: 'bg-green-400', invited: 'bg-yellow-400', inactive: 'bg-zinc-500' }

const INITIAL_CREW: CrewMember[] = [
  { id: '1', name: 'Bo Legacy', role: 'admin', email: 'bo@legacyelectrical.com', phone: '(337) 555-0100', status: 'active', notifications: { email: true, sms: true, push: true }, assignments: ['All Projects'], hoursWeek: 45, hoursMonth: 180 },
  { id: '2', name: 'Tyler Menard', role: 'pm', email: 'tyler@legacyelectrical.com', phone: '(337) 555-0101', status: 'active', notifications: { email: true, sms: true, push: false }, assignments: ['142 Oak Ridge Dr', '891 Cypress Bend', '2200 Magnolia Estates', '567 Pelican Way', '1800 Bayou Park'], hoursWeek: 42, hoursMonth: 168 },
  { id: '3', name: 'Mario Herrera', role: 'sub_crew_lead', email: 'mario@legacyelectrical.com', phone: '(337) 555-0102', status: 'active', notifications: { email: true, sms: true, push: true }, assignments: ['142 Oak Ridge Dr', '567 Pelican Way'], hoursWeek: 40, hoursMonth: 160 },
]

const EMPTY_FORM = { name: '', email: '', phone: '', role: 'crew' as Role, notifications: { email: true, sms: true, push: false } }

export default function AdminCrew() {
  const [crew, setCrew] = useState<CrewMember[]>(INITIAL_CREW)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [toast, setToast] = useState<string | null>(null)

  const [notifRules, setNotifRules] = useState({
    jobAssignment: true,
    taskCompletion: true,
    phaseCompletion: true,
    dailyDigest: true,
    overtimeAlerts: true,
  })

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const openAdd = () => { setEditingId(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (m: CrewMember) => {
    setEditingId(m.id)
    setForm({ name: m.name, email: m.email, phone: m.phone, role: m.role, notifications: { ...m.notifications } })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name || !form.email || !form.phone) return
    if (editingId) {
      setCrew(crew.map(m => m.id === editingId ? { ...m, ...form } : m))
      showToast(`Updated ${form.name}`)
    } else {
      const newMember: CrewMember = {
        id: Date.now().toString(), ...form, status: 'invited', assignments: [], hoursWeek: 0, hoursMonth: 0,
      }
      setCrew([...crew, newMember])
      showToast(`Invite sent to ${form.email} and ${form.phone}`)
    }
    setShowModal(false)
  }

  const deactivate = (id: string) => {
    setCrew(crew.map(m => m.id === id ? { ...m, status: m.status === 'inactive' ? 'active' : 'inactive' } : m))
  }

  const resendInvite = (m: CrewMember) => showToast(`Invite resent to ${m.email} and ${m.phone}`)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-[60] bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-pulse">
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Crew Management</h1>
            <p className="text-zinc-400 text-sm mt-1">{crew.length} team members</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            <UserPlus className="w-4 h-4" /> Add Team Member
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h3>
                <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Full Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="Full Name" />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Phone Number *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="(337) 555-0000" />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Role</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as Role })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                    <option value="admin">Admin</option>
                    <option value="pm">Project Manager</option>
                    <option value="sub_crew_lead">Sub Crew Lead</option>
                    <option value="crew">Crew</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Notification Preferences</label>
                  <div className="flex gap-4">
                    {(['email', 'sms', 'push'] as const).map(k => (
                      <label key={k} className="flex items-center gap-2 text-sm text-zinc-300">
                        <input type="checkbox" checked={form.notifications[k]}
                          onChange={e => setForm({ ...form, notifications: { ...form.notifications, [k]: e.target.checked } })}
                          className="rounded bg-zinc-700 border-zinc-600 text-blue-500 focus:ring-blue-500" />
                        {k === 'email' ? 'Email' : k === 'sms' ? 'SMS' : 'Push'}
                      </label>
                    ))}
                  </div>
                </div>
                <button onClick={handleSave}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium transition">
                  {editingId ? 'Save Changes' : 'Send Invite'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Crew Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crew.map(member => (
            <div key={member.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[member.status]}`} title={member.status} />
                  <div>
                    <div className="text-white font-medium">{member.name}</div>
                    <div className="text-zinc-500 text-xs mt-0.5">{member.email}</div>
                    <div className="text-zinc-500 text-xs">{member.phone}</div>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_COLORS[member.role]}`}>
                  {ROLE_LABELS[member.role]}
                </span>
              </div>

              {/* Notification icons */}
              <div className="flex gap-2 mb-3">
                <Mail className={`w-4 h-4 ${member.notifications.email ? 'text-blue-400' : 'text-zinc-600'}`} />
                <Phone className={`w-4 h-4 ${member.notifications.sms ? 'text-blue-400' : 'text-zinc-600'}`} />
                <Bell className={`w-4 h-4 ${member.notifications.push ? 'text-blue-400' : 'text-zinc-600'}`} />
              </div>

              <div className="text-sm text-zinc-400 mb-2">Current Assignments</div>
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
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-800">
                <button onClick={() => openEdit(member)} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-blue-400 transition">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => deactivate(member.id)} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-400 transition">
                  <UserX className="w-3.5 h-3.5" /> {member.status === 'inactive' ? 'Activate' : 'Deactivate'}
                </button>
                {member.status === 'invited' && (
                  <button onClick={() => resendInvite(member)} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-yellow-400 transition">
                    <Send className="w-3.5 h-3.5" /> Resend Invite
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Notification Rules */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Notification Rules</h2>
          <div className="space-y-3">
            {([
              ['jobAssignment', 'Notify crew on job assignment'],
              ['taskCompletion', 'Notify PM on task completion'],
              ['phaseCompletion', 'Notify admin on phase completion'],
              ['dailyDigest', 'Daily schedule digest (7 AM)'],
              ['overtimeAlerts', 'Overtime alerts (>40 hrs/week)'],
            ] as const).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">{label}</span>
                <button onClick={() => setNotifRules({ ...notifRules, [key]: !notifRules[key] })} className="text-zinc-400">
                  {notifRules[key as keyof typeof notifRules]
                    ? <ToggleRight className="w-8 h-8 text-blue-500" />
                    : <ToggleLeft className="w-8 h-8 text-zinc-600" />}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-400">
              <span className="text-blue-400 font-medium">Preview:</span> Mario Herrera will receive: Email + SMS when assigned a new job
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
