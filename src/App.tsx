import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Login from './pages/Login'

// Role selector
const RoleSelect = React.lazy(() => import('./pages/RoleSelect'))

// Lazy load dashboards
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'))
const AdminProjects = React.lazy(() => import('./pages/admin/Projects'))
const AdminProjectDetail = React.lazy(() => import('./pages/admin/ProjectDetail'))
const AdminFinancials = React.lazy(() => import('./pages/admin/Financials'))
const AdminCrew = React.lazy(() => import('./pages/admin/Crew'))
const AdminBuilders = React.lazy(() => import('./pages/admin/Builders'))
const AdminReports = React.lazy(() => import('./pages/admin/Reports'))
const AdminSettings = React.lazy(() => import('./pages/admin/Settings'))

const PMDashboard = React.lazy(() => import('./pages/pm/Dashboard'))
const PMProjectDetail = React.lazy(() => import('./pages/pm/ProjectDetail'))
const PMSchedule = React.lazy(() => import('./pages/pm/Schedule'))
const PMInspections = React.lazy(() => import('./pages/pm/Inspections'))
const PMInvoices = React.lazy(() => import('./pages/pm/Invoices'))
const PMMaterials = React.lazy(() => import('./pages/pm/Materials'))

const CrewToday = React.lazy(() => import('./pages/crew/Today'))
const CrewProject = React.lazy(() => import('./pages/crew/Project'))
const CrewTime = React.lazy(() => import('./pages/crew/Time'))
const CrewJobs = React.lazy(() => import('./pages/crew/Jobs'))
const CrewProfile = React.lazy(() => import('./pages/crew/Profile'))

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-blue-400 text-xl font-bold animate-pulse">⚡ Legacy Electrical</div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RoleSelect />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/projects/:id" element={<AdminProjectDetail />} />
            <Route path="/admin/financials" element={<AdminFinancials />} />
            <Route path="/admin/crew" element={<AdminCrew />} />
            <Route path="/admin/builders" element={<AdminBuilders />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* PM */}
            <Route path="/pm" element={<PMDashboard />} />
            <Route path="/pm/projects/:id" element={<PMProjectDetail />} />
            <Route path="/pm/schedule" element={<PMSchedule />} />
            <Route path="/pm/inspections" element={<PMInspections />} />
            <Route path="/pm/invoices" element={<PMInvoices />} />
            <Route path="/pm/materials" element={<PMMaterials />} />

            {/* Crew */}
            <Route path="/crew" element={<CrewToday />} />
            <Route path="/crew/project/:id" element={<CrewProject />} />
            <Route path="/crew/time" element={<CrewTime />} />
            <Route path="/crew/jobs" element={<CrewJobs />} />
            <Route path="/crew/profile" element={<CrewProfile />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
