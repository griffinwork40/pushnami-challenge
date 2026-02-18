'use client';

import { useState, useEffect, useCallback } from 'react';
import ExperimentPanel from '../../components/ExperimentPanel';
import { fetchExperiments, createExperiment, updateExperiment } from '../../lib/api';
import type { Experiment } from '@pushnami/shared/types';

interface Toast { message: string; type: 'success' | 'error'; }

const BLANK_FORM = { name: '', description: '', v1: 'control', v2: 'variant_a', split1: 50, split2: 50 };

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [toast, setToast]       = useState<Toast | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(BLANK_FORM);
  const [creating, setCreating] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    try {
      const data = await fetchExperiments();
      setExperiments(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load experiments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusUpdate = async (id: string, status: 'active' | 'paused' | 'completed') => {
    setUpdating(id);
    try {
      const updated = await updateExperiment(id, { status });
      setExperiments((prev) => prev.map((e) => e.id === id ? updated : e));
      showToast(`Experiment ${status}`, 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Update failed', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = form.split1 + form.split2;
    if (total !== 100) { showToast('Traffic split must sum to 100', 'error'); return; }
    if (!form.name.trim()) { showToast('Name is required', 'error'); return; }

    setCreating(true);
    try {
      const newExp = await createExperiment({
        name: form.name,
        description: form.description,
        variants: [
          { name: form.v1, description: '' },
          { name: form.v2, description: '' },
        ],
        trafficSplit: [form.split1, form.split2],
      });
      setExperiments((prev) => [newExp, ...prev]);
      setForm(BLANK_FORM);
      setShowForm(false);
      showToast('Experiment created!', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Create failed', 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Experiments</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={load}>↻ Refresh</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? '✕ Cancel' : '+ New Experiment'}
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>New Experiment</h2>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Name *</label>
                <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Homepage Hero Test" required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea className="form-input form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is this experiment testing?" />
              </div>
              <div className="form-group">
                <label className="form-label">Variant A Name</label>
                <input className="form-input" value={form.v1} onChange={(e) => setForm({ ...form, v1: e.target.value })} placeholder="control" />
              </div>
              <div className="form-group">
                <label className="form-label">Variant B Name</label>
                <input className="form-input" value={form.v2} onChange={(e) => setForm({ ...form, v2: e.target.value })} placeholder="variant_a" />
              </div>
              <div className="form-group">
                <label className="form-label">Variant A Traffic %</label>
                <input type="number" className="form-input" min={0} max={100} value={form.split1}
                  onChange={(e) => { const v = Number(e.target.value); setForm({ ...form, split1: v, split2: 100 - v }); }} />
              </div>
              <div className="form-group">
                <label className="form-label">Variant B Traffic %</label>
                <input type="number" className="form-input" min={0} max={100} value={form.split2}
                  onChange={(e) => { const v = Number(e.target.value); setForm({ ...form, split2: v, split1: 100 - v }); }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={creating}>
                {creating ? 'Creating…' : 'Create Experiment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /> Loading experiments…</div>
      ) : experiments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 48 }}>
          No experiments yet. Create one above!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {experiments.map((exp) => (
            <ExperimentPanel key={exp.id} experiment={exp} onUpdate={handleStatusUpdate} updating={updating === exp.id} />
          ))}
        </div>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
