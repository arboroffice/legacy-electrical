export type UserRole = 'admin' | 'pm' | 'crew'

export interface User {
  id: string
  auth_id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  created_at: string
}

export interface Project {
  id: string
  name: string
  address: string
  client_name: string
  builder_name: string
  contract_amount: number
  current_phase: number
  status: 'active' | 'complete' | 'on_hold'
  pm_id?: string
  created_at: string
}

export interface PhaseTask {
  id: string
  phase_id: string
  project_id: string
  phase_number: number
  title: string
  assigned_role: UserRole | 'pm' | 'crew'
  assigned_user_id?: string
  is_complete: boolean
  completed_at?: string
  completed_by?: string
}

export interface Invoice {
  id: string
  project_id: string
  amount: number
  percentage: number
  phase_trigger: number
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue'
  sent_at?: string
  paid_at?: string
  due_date?: string
}

export interface Material {
  id: string
  project_id: string
  phase_id: string
  item: string
  quantity: number
  cost?: number
  status: 'requested' | 'approved' | 'ordered' | 'delivered' | 'installed'
  requested_by: string
  approved_by?: string
}

export interface Inspection {
  id: string
  project_id: string
  phase_id: string
  type: string
  scheduled_date: string
  status: 'scheduled' | 'passed' | 'failed' | 'reinspect'
  notes?: string
}

export interface ChangeOrder {
  id: string
  project_id: string
  description: string
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  requested_at: string
  approved_at?: string
}

export interface TimeEntry {
  id: string
  user_id: string
  project_id: string
  clock_in: string
  clock_out?: string
  hours?: number
  notes?: string
}

// The 6 phases
export const PROJECT_PHASES = [
  { number: 1, name: 'Awarded', color: 'blue' },
  { number: 2, name: 'Slab', color: 'orange' },
  { number: 3, name: 'Pre Rough', color: 'yellow' },
  { number: 4, name: 'Rough In', color: 'amber' },
  { number: 5, name: 'Power Ready', color: 'green' },
  { number: 6, name: 'Punch Out', color: 'emerald' },
] as const

// Default tasks per phase (from handwritten workflow)
export const DEFAULT_PHASE_TASKS: Record<number, { title: string, role: 'pm' | 'crew' }[]> = {
  1: [
    { title: 'Print plans', role: 'pm' },
    { title: 'Schedule temp pole install', role: 'pm' },
    { title: 'Sub installs temp pole', role: 'crew' },
  ],
  2: [
    { title: 'Schedule slab install', role: 'pm' },
    { title: 'Order slab materials to job site or sub location', role: 'pm' },
    { title: 'Sub installs materials', role: 'crew' },
  ],
  3: [
    { title: 'Schedule walk through', role: 'pm' },
    { title: 'Redline plans', role: 'pm' },
    { title: 'Sub makes material list', role: 'crew' },
    { title: 'Schedule delivery', role: 'pm' },
    { title: 'Verify builder will deliver cans', role: 'pm' },
    { title: 'Schedule sub for install', role: 'pm' },
  ],
  4: [
    { title: 'Subs install materials', role: 'crew' },
    { title: 'Organize change orders', role: 'pm' },
    { title: 'Inspection', role: 'pm' },
    { title: 'Final inspection', role: 'pm' },
    { title: 'Invoice & collect 65%', role: 'pm' },
  ],
  5: [
    { title: 'Sub makes material list', role: 'crew' },
    { title: 'Schedule delivery', role: 'pm' },
    { title: 'Installation complete', role: 'crew' },
    { title: 'Call inspection', role: 'pm' },
    { title: 'Invoice builder 35%', role: 'pm' },
  ],
  6: [
    { title: 'Sub responsibility', role: 'crew' },
    { title: 'Final fixture sets delivered', role: 'pm' },
    { title: 'Complete / final inspection', role: 'pm' },
  ],
}
