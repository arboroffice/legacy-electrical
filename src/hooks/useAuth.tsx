import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import type { UserRole } from '../types'

interface AuthContextType {
  user: SupabaseUser | null
  role: UserRole | ''
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: '',
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
})

// Demo mode when Supabase isn't configured
const DEMO_MODE = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [role, setRole] = useState<UserRole | ''>('')
  const [loading, setLoading] = useState(true)

  async function fetchRole(authId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', authId)
      .single()
    if (error || !data) {
      setRole('')
    } else {
      setRole(data.role as UserRole)
    }
  }

  // In demo mode, derive role from URL path
  useEffect(() => {
    if (!DEMO_MODE) return
    const path = window.location.pathname
    let detectedRole: UserRole = 'admin'
    let email = 'admin@legacyelectrical.com'
    if (path.startsWith('/crew')) {
      detectedRole = 'crew'
      email = 'mike@legacyelectrical.com'
    } else if (path.startsWith('/pm')) {
      detectedRole = 'pm'
      email = 'pm@legacyelectrical.com'
    }
    setUser({ id: 'demo', email } as any)
    setRole(detectedRole)
    setLoading(false)
  })

  useEffect(() => {
    // Demo mode: skip Supabase auth
    if (DEMO_MODE) return

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchRole(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, session: Session | null) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchRole(session.user.id)
        } else {
          setRole('')
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setRole('')
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
