import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'

interface CalendarEvent {
  date: string // YYYY-MM-DD
  title: string
  project: string
  type: 'inspection' | 'delivery' | 'walkthrough' | 'deadline'
}

const EVENT_COLORS: Record<string, { dot: string; text: string; bg: string }> = {
  inspection: { dot: 'bg-blue-400', text: 'text-blue-400', bg: 'bg-blue-500/10' },
  delivery: { dot: 'bg-green-400', text: 'text-green-400', bg: 'bg-green-500/10' },
  walkthrough: { dot: 'bg-yellow-400', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  deadline: { dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-500/10' },
}

// Generate mock events for current month
function generateMockEvents(year: number, month: number): CalendarEvent[] {
  const pad = (n: number) => String(n).padStart(2, '0')
  const m = pad(month + 1)
  return [
    { date: `${year}-${m}-${pad(3)}`, title: 'Rough-In Inspection', project: 'Oak Ridge Lot 7', type: 'inspection' },
    { date: `${year}-${m}-${pad(5)}`, title: 'Material Delivery', project: 'Sunrise Heights Lot 12', type: 'delivery' },
    { date: `${year}-${m}-${pad(5)}`, title: 'Walk Through', project: 'Brookstone Lot 22', type: 'walkthrough' },
    { date: `${year}-${m}-${pad(8)}`, title: 'Invoice Due', project: 'The Reserve Lot 5', type: 'deadline' },
    { date: `${year}-${m}-${pad(10)}`, title: 'Final Inspection', project: 'Oak Ridge Lot 7', type: 'inspection' },
    { date: `${year}-${m}-${pad(12)}`, title: 'Slab Material Delivery', project: 'Heritage Point Lot 14', type: 'delivery' },
    { date: `${year}-${m}-${pad(15)}`, title: 'Pre-Rough Walk Through', project: 'Sunrise Heights Lot 12', type: 'walkthrough' },
    { date: `${year}-${m}-${pad(18)}`, title: 'Permit Deadline', project: 'Heritage Point Lot 14', type: 'deadline' },
    { date: `${year}-${m}-${pad(20)}`, title: 'Rough-In Inspection', project: 'Brookstone Lot 22', type: 'inspection' },
    { date: `${year}-${m}-${pad(22)}`, title: 'Fixture Delivery', project: 'The Reserve Lot 5', type: 'delivery' },
    { date: `${year}-${m}-${pad(25)}`, title: 'Final Walk Through', project: 'Oak Ridge Lot 7', type: 'walkthrough' },
    { date: `${year}-${m}-${pad(28 > new Date(year, month + 1, 0).getDate() ? new Date(year, month + 1, 0).getDate() : 28)}`, title: 'Final Inspection', project: 'Sunrise Heights Lot 12', type: 'inspection' },
  ]
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function PMSchedule() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const events = generateMockEvents(currentYear, currentMonth)

  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
    setSelectedDate(null)
  }

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
    setSelectedDate(null)
  }

  const pad = (n: number) => String(n).padStart(2, '0')
  const dateStr = (day: number) => `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`
  const getEventsForDay = (day: number) => events.filter(e => e.date === dateStr(day))
  const selectedEvents = selectedDate ? events.filter(e => e.date === selectedDate) : []

  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/pm" className="text-zinc-400 hover:text-white text-sm mb-2 inline-block">← Back to Dashboard</Link>
            <h1 className="text-2xl font-bold text-white">Schedule</h1>
          </div>
          {/* Legend */}
          <div className="flex gap-4 text-xs">
            {Object.entries(EVENT_COLORS).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                <span className="text-zinc-400 capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 text-zinc-400 hover:text-white transition">◀</button>
            <h2 className="text-lg font-semibold text-white">{MONTHS[currentMonth]} {currentYear}</h2>
            <button onClick={nextMonth} className="p-2 text-zinc-400 hover:text-white transition">▶</button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs text-zinc-500 font-medium py-2">{d}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before first of month */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const ds = dateStr(day)
              const dayEvents = getEventsForDay(day)
              const isToday = ds === todayStr
              const isSelected = ds === selectedDate

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(ds === selectedDate ? null : ds)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition text-sm ${
                    isSelected ? 'bg-blue-500/20 border border-blue-500' :
                    isToday ? 'bg-zinc-800 border border-zinc-600' :
                    'hover:bg-zinc-800 border border-transparent'
                  }`}
                >
                  <span className={isToday ? 'text-blue-400 font-bold' : 'text-zinc-300'}>{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5">
                      {dayEvents.map((e, j) => (
                        <div key={j} className={`w-1.5 h-1.5 rounded-full ${EVENT_COLORS[e.type].dot}`} />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Day Events */}
        {selectedDate && (
          <div className="space-y-3">
            <h3 className="text-white font-medium">
              Events for {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            {selectedEvents.length === 0 ? (
              <p className="text-zinc-500 text-sm">No events scheduled</p>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map((event, i) => {
                  const colors = EVENT_COLORS[event.type]
                  return (
                    <div key={i} className={`${colors.bg} border border-zinc-800 rounded-xl p-4 flex items-center gap-3`}>
                      <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                      <div>
                        <p className="text-white text-sm font-medium">{event.title}</p>
                        <p className={`text-xs ${colors.text}`}>{event.project}</p>
                      </div>
                      <span className={`ml-auto text-xs capitalize ${colors.text}`}>{event.type}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
