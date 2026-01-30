import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Login from './pages/Login'

// Lazy load dashboards
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'))
const AdminProjects = React.lazy(() => import('./pages/admin/Projects'))
const AdminProjectDetail = React.lazy(() => import('./pages/admin/ProjectDetail'))
const AdminFinancials = React.lazy(() => import('./pages/admin/Financials'))
const AdminCrew = React.lazy(() => import('./pages/admin/Crew'))

const PMDashboard = React.lazy(() => import('./pages/pm/Dashboard'))
const PMProjectDetail = React.lazy(() => import('./pages/pm/ProjectDetail'))
const PMSchedule = React.lazy(() => import('./pages/pm/Schedule'))

const CrewToday = React.lazy(() => import('./pages/crew/Today'))
const CrewProject = React.lazy(() => import('./pages/crew/Project'))
const CrewTime = React.lazy(() => import('./pages/crew/Time'))

// Protected route component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const { user, role, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" />
  if (!allowedRoles.includes(role)) return <Navigate to="/login" />
  return <>{children}</>
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-amber-400 text-xl font-bold animate-pulse">⚡ Legacy Electrical</div>
    </div>
  )
}

// Role-based redirect after login
function RoleRedirect() {
  const { role, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (role === 'admin') return <Navigate to="/admin" />
  if (role === 'pm') return <Navigate to="/pm" />
  if (role === 'crew') return <Navigate to="/crew" />
  return <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RoleRedirect />} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute allowedRoles={['admin']}><AdminProjects /></ProtectedRoute>} />
            <Route path="/admin/projects/:id" element={<ProtectedRoute allowedRoles={['admin', 'pm']}><AdminProjectDetail /></ProtectedRoute>} />
            <Route path="/admin/financials" element={<ProtectedRoute allowedRoles={['admin']}><AdminFinancials /></ProtectedRoute>} />
            <Route path="/admin/crew" element={<ProtectedRoute allowedRoles={['admin']}><AdminCrew /></ProtectedRoute>} />

            {/* PM */}
            <Route path="/pm" element={<ProtectedRoute allowedRoles={['admin', 'pm']}><PMDashboard /></ProtectedRoute>} />
            <Route path="/pm/projects/:id" element={<ProtectedRoute allowedRoles={['admin', 'pm']}><PMProjectDetail /></ProtectedRoute>} />
            <Route path="/pm/schedule" element={<ProtectedRoute allowedRoles={['admin', 'pm']}><PMSchedule /></ProtectedRoute>} />

            {/* Crew */}
            <Route path="/crew" element={<ProtectedRoute allowedRoles={['admin', 'pm', 'crew']}><CrewToday /></ProtectedRoute>} />
            <Route path="/crew/project/:id" element={<ProtectedRoute allowedRoles={['admin', 'pm', 'crew']}><CrewProject /></ProtectedRoute>} />
            <Route path="/crew/time" element={<ProtectedRoute allowedRoles={['admin', 'pm', 'crew']}><CrewTime /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
