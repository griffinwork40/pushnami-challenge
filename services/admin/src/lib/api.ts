import type { Experiment, FeatureToggle, ExperimentStats, CreateExperimentRequest, UpdateExperimentRequest } from '@pushnami/shared/types';

// ─── Toggles ─────────────────────────────────────────────────────────────────

export async function fetchToggles(): Promise<FeatureToggle[]> {
  const res = await fetch('/api/toggles');
  if (!res.ok) throw new Error(`Failed to fetch toggles: ${res.statusText}`);
  return res.json();
}

export async function updateToggle(id: string, enabled: boolean): Promise<FeatureToggle> {
  const res = await fetch('/api/toggles', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, enabled }),
  });
  if (!res.ok) throw new Error(`Failed to update toggle: ${res.statusText}`);
  return res.json();
}

// ─── Experiments ─────────────────────────────────────────────────────────────

export async function fetchExperiments(): Promise<Experiment[]> {
  const res = await fetch('/api/experiments');
  if (!res.ok) throw new Error(`Failed to fetch experiments: ${res.statusText}`);
  return res.json();
}

export async function createExperiment(data: CreateExperimentRequest): Promise<Experiment> {
  const res = await fetch('/api/experiments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create experiment: ${res.statusText}`);
  return res.json();
}

export async function updateExperiment(id: string, data: UpdateExperimentRequest): Promise<Experiment> {
  const res = await fetch('/api/experiments', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error(`Failed to update experiment: ${res.statusText}`);
  return res.json();
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function fetchStats(experimentId?: string): Promise<ExperimentStats[]> {
  const url = experimentId ? `/api/stats?experimentId=${experimentId}` : '/api/stats';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.statusText}`);
  return res.json();
}
