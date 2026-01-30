import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { user, signIn, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return null
  if (user) return <Navigate to="/" />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: err } = await signIn(email, password)
    if (err) setError(err)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Legacy Electrical</h1>
          <p className="text-zinc-400 mt-1">Project Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="you@legacyelectrical.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 text-slate-950 font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button className="text-sm text-zinc-400 hover:text-blue-400 transition">
              Forgot password?
            </button>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © {new Date().getFullYear()} Legacy Electrical. All rights reserved.
        </p>
      </div>
    </div>
  )
}
