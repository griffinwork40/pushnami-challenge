-- ─── Database Schema ──────────────────────────────────────────────────────────
-- Production-grade schema with proper indexes, constraints, and defaults

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Experiments ─────────────────────────────────────────────────────────────
CREATE TABLE experiments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Variants ────────────────────────────────────────────────────────────────
CREATE TABLE variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT DEFAULT '',
  traffic_pct SMALLINT NOT NULL CHECK (traffic_pct BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_variants_experiment ON variants(experiment_id);

-- ─── Assignments ─────────────────────────────────────────────────────────────
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id UUID NOT NULL,
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(visitor_id, experiment_id)
);

CREATE INDEX idx_assignments_visitor ON assignments(visitor_id);
CREATE INDEX idx_assignments_experiment ON assignments(experiment_id);

-- ─── Events ──────────────────────────────────────────────────────────────────
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id UUID NOT NULL,
  experiment_id UUID NOT NULL,
  variant_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('page_view', 'click', 'form_submit', 'cta_click', 'scroll_depth')),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_experiment ON events(experiment_id);
CREATE INDEX idx_events_variant ON events(variant_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_created ON events(created_at);
-- Composite index for common query pattern
CREATE INDEX idx_events_exp_variant ON events(experiment_id, variant_id);

-- ─── Feature Toggles ────────────────────────────────────────────────────────
CREATE TABLE feature_toggles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  description TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Seed Data ───────────────────────────────────────────────────────────────

-- Default feature toggles
INSERT INTO feature_toggles (key, enabled, description) VALUES
  ('show_hero_banner', true, 'Display hero banner section on landing page'),
  ('enable_social_proof', true, 'Show social proof / testimonials section'),
  ('cta_style_aggressive', false, 'Use aggressive CTA copy and styling');

-- Default experiment
INSERT INTO experiments (id, name, description, status) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Homepage Hero Test', 'Test different hero section messaging for conversion optimization', 'active');

INSERT INTO variants (experiment_id, name, description, traffic_pct) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'control', 'Original hero messaging', 50),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'variant_a', 'Benefits-focused messaging', 50);
