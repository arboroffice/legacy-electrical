-- ============================================
-- Legacy Electrical — Database Schema
-- ============================================

-- Users (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'crew' CHECK (role IN ('admin', 'pm', 'crew')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = auth_id);
CREATE POLICY "Admins can manage users" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  client_name TEXT,
  builder_name TEXT NOT NULL,
  contract_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  current_phase INTEGER NOT NULL DEFAULT 1 CHECK (current_phase BETWEEN 1 AND 6),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'complete', 'on_hold', 'cancelled')),
  pm_id UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All auth users can view projects" ON projects FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin and PM can manage projects" ON projects FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'pm'))
);

-- Phase Tasks (checklist items per phase per project)
CREATE TABLE IF NOT EXISTS phase_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL CHECK (phase_number BETWEEN 1 AND 6),
  title TEXT NOT NULL,
  assigned_role TEXT NOT NULL DEFAULT 'crew' CHECK (assigned_role IN ('pm', 'crew')),
  assigned_user_id UUID REFERENCES users(id),
  is_complete BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES users(id),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE phase_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view tasks" ON phase_tasks FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can update tasks" ON phase_tasks FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin/PM can manage tasks" ON phase_tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'pm'))
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  percentage INTEGER NOT NULL CHECK (percentage IN (65, 35)),
  phase_trigger INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'overdue')),
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  due_date DATE,
  pdf_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view invoices" ON invoices FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin/PM can manage invoices" ON invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'pm'))
);

-- Materials
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  item TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit TEXT,
  cost NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'ordered', 'delivered', 'installed')),
  requested_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  delivered_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view materials" ON materials FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can create materials" ON materials FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin/PM can manage materials" ON materials FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'pm'))
);

-- Inspections
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  type TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'passed', 'failed', 'reinspect')),
  inspector_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view inspections" ON inspections FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin/PM can manage inspections" ON inspections FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'pm'))
);

-- Change Orders
CREATE TABLE IF NOT EXISTS change_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES users(id),
  notes TEXT
);
ALTER TABLE change_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view change_orders" ON change_orders FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin/PM can manage change_orders" ON change_orders FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'pm'))
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_number INTEGER,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  type TEXT DEFAULT 'document' CHECK (type IN ('plan', 'redline', 'permit', 'change_order', 'photo', 'document')),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view documents" ON documents FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can upload documents" ON documents FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Photos
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  task_id UUID REFERENCES phase_tasks(id),
  file_url TEXT NOT NULL,
  caption TEXT,
  taken_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view photos" ON photos FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can upload photos" ON photos FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Time Entries
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  clock_in TIMESTAMPTZ NOT NULL DEFAULT now(),
  clock_out TIMESTAMPTZ,
  hours NUMERIC(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own time" ON time_entries FOR SELECT USING (
  auth.uid() = (SELECT auth_id FROM users WHERE id = user_id) OR
  EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('admin', 'pm'))
);
CREATE POLICY "Users can manage own time" ON time_entries FOR ALL USING (
  auth.uid() = (SELECT auth_id FROM users WHERE id = user_id)
);
CREATE POLICY "Admin can manage all time" ON time_entries FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role = 'admin')
);

-- Activity Log
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view activity" ON activity_log FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can create activity" ON activity_log FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Auth users can upload files" ON storage.objects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND bucket_id IN ('project-files', 'photos'));
CREATE POLICY "Auth users can view files" ON storage.objects FOR SELECT USING (auth.uid() IS NOT NULL AND bucket_id IN ('project-files', 'photos'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_pm ON projects(pm_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_phase_tasks_project ON phase_tasks(project_id, phase_number);
CREATE INDEX IF NOT EXISTS idx_invoices_project ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_materials_project ON materials(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_project ON activity_log(project_id);
