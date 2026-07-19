PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS academy_users (
  email TEXT PRIMARY KEY,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'planner' CHECK (role IN ('ceo', 'coo', 'planner', 'editor', 'admin')),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  current_stage INTEGER NOT NULL DEFAULT 1 CHECK (current_stage IN (1, 3, 6)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS module_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL,
  module_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'pending_review', 'passed', 'needs_improvement')),
  self_note TEXT,
  reviewed_by TEXT,
  reviewer_note TEXT,
  improvement_due_at TEXT,
  passed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES academy_users(email) ON DELETE CASCADE,
  UNIQUE (user_email, module_id)
);

CREATE TABLE IF NOT EXISTS work_evidence (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL,
  module_id TEXT NOT NULL,
  stage_month INTEGER NOT NULL CHECK (stage_month IN (1, 3, 6)),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  source_system TEXT NOT NULL CHECK (source_system IN ('Monday', 'Notion', 'Drive', 'NAS', 'Slack', 'LINE OA', 'GitHub', 'Other')),
  source_url TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  reviewed_by TEXT,
  reviewer_note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES academy_users(email) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_work_evidence_user_stage ON work_evidence(user_email, stage_month);
CREATE INDEX IF NOT EXISTS idx_work_evidence_module ON work_evidence(module_id);

CREATE TABLE IF NOT EXISTS stage_assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL,
  stage_month INTEGER NOT NULL CHECK (stage_month IN (1, 3, 6)),
  result TEXT NOT NULL DEFAULT 'not_started' CHECK (result IN ('not_started', 'in_progress', 'pending_review', 'passed', 'needs_improvement')),
  reviewer_email TEXT,
  summary TEXT,
  strengths TEXT,
  gaps TEXT,
  improvement_plan TEXT,
  improvement_due_at TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES academy_users(email) ON DELETE CASCADE,
  UNIQUE (user_email, stage_month)
);

CREATE TABLE IF NOT EXISTS manager_feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_email TEXT NOT NULL,
  manager_email TEXT NOT NULL,
  stage_month INTEGER CHECK (stage_month IN (1, 3, 6)),
  feedback_type TEXT NOT NULL DEFAULT 'general' CHECK (feedback_type IN ('general', 'strength', 'risk', 'action_required', 'assessment')),
  content TEXT NOT NULL,
  due_at TEXT,
  resolved_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_email) REFERENCES academy_users(email) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_feedback_user_created ON manager_feedback(user_email, created_at DESC);

CREATE TABLE IF NOT EXISTS academy_content_versions (
  content_key TEXT PRIMARY KEY,
  version TEXT NOT NULL,
  owner_email TEXT,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('draft', 'pending_approval', 'approved', 'archived')),
  source_url TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
