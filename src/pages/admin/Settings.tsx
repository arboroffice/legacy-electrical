import { useState } from 'react'
import Layout from '../../components/Layout'

function Toggle({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-zinc-300">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-6 rounded-full transition-colors relative ${on ? 'bg-blue-500' : 'bg-zinc-700'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${on ? 'left-5' : 'left-1'}`} />
      </button>
    </div>
  )
}

export default function AdminSettings() {
  return (
    <Layout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-zinc-400 text-sm mt-1">Company configuration & preferences</p>
        </div>

        {/* Company Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Company Info</h2>
            <button className="text-xs text-blue-400 hover:text-blue-300 transition">Edit</button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-zinc-500">Company Name</div>
              <div className="text-white mt-1">Legacy Electrical LLC</div>
            </div>
            <div>
              <div className="text-zinc-500">Phone</div>
              <div className="text-white mt-1">(405) 555-0100</div>
            </div>
            <div>
              <div className="text-zinc-500">Email</div>
              <div className="text-white mt-1">office@legacyelectrical.com</div>
            </div>
            <div>
              <div className="text-zinc-500">License #</div>
              <div className="text-white mt-1">EC-2024-1847</div>
            </div>
            <div className="col-span-2">
              <div className="text-zinc-500">Address</div>
              <div className="text-white mt-1">2847 Industrial Blvd, Oklahoma City, OK 73112</div>
            </div>
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-white font-semibold">Invoice Settings</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-zinc-500 block mb-1">Default Split</label>
              <div className="flex items-center gap-2">
                <input defaultValue="65" className="w-16 px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm text-center focus:outline-none focus:border-blue-500" />
                <span className="text-zinc-500 text-sm">/</span>
                <input defaultValue="35" className="w-16 px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm text-center focus:outline-none focus:border-blue-500" />
                <span className="text-zinc-500 text-sm">%</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-zinc-500 block mb-1">Payment Terms</label>
              <select defaultValue="net30" className="w-full px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500">
                <option value="net15">Net 15</option>
                <option value="net30">Net 30</option>
                <option value="net45">Net 45</option>
                <option value="net60">Net 60</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-zinc-500 block mb-1">Late Fee</label>
              <div className="flex items-center gap-2">
                <input defaultValue="1.5" className="w-20 px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm text-center focus:outline-none focus:border-blue-500" />
                <span className="text-zinc-500 text-sm">% / month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
          <h2 className="text-white font-semibold mb-2">Notification Preferences</h2>
          <Toggle label="New project assigned" defaultOn />
          <Toggle label="Inspection scheduled" defaultOn />
          <Toggle label="Invoice overdue" defaultOn />
          <Toggle label="Crew clock in/out" />
          <Toggle label="Phase completed" defaultOn />
        </div>

        {/* Integrations */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-white font-semibold">Integrations</h2>
          <div className="space-y-3">
            {['QuickBooks', 'Google Calendar', 'SMS Notifications'].map(name => (
              <div key={name} className="flex items-center justify-between py-2 px-3 bg-zinc-800 rounded-lg">
                <span className="text-sm text-zinc-300">{name}</span>
                <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-1 rounded-full">Coming Soon</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
