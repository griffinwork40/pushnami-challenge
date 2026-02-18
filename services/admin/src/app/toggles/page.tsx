'use client';

import { useState, useEffect, useCallback } from 'react';
import ToggleCard from '../../components/ToggleCard';
import { fetchToggles, updateToggle } from '../../lib/api';
import type { FeatureToggle } from '@pushnami/shared/types';

interface Toast { message: string; type: 'success' | 'error'; }

export default function TogglesPage() {
  const [toggles, setToggles]   = useState<FeatureToggle[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [toast, setToast]       = useState<Toast | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    try {
      const data = await fetchToggles();
      setToggles(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load toggles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (id: string, enabled: boolean) => {
    // Optimistic update
    setToggles((prev) => prev.map((t) => t.id === id ? { ...t, enabled } : t));
    setUpdating(id);
    try {
      const updated = await updateToggle(id, enabled);
      setToggles((prev) => prev.map((t) => t.id === id ? updated : t));
      showToast(`Toggle ${enabled ? 'enabled' : 'disabled'} successfully`, 'success');
    } catch (e) {
      // Rollback
      setToggles((prev) => prev.map((t) => t.id === id ? { ...t, enabled: !enabled } : t));
      showToast(e instanceof Error ? e.message : 'Failed to update toggle', 'error');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Feature Toggles</h1>
        <button className="btn btn-secondary btn-sm" onClick={load}>↻ Refresh</button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /> Loading toggles…</div>
      ) : toggles.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 48 }}>
          No feature toggles found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {toggles.map((t) => (
            <ToggleCard
              key={t.id}
              toggle={t}
              onToggle={handleToggle}
              updating={updating === t.id}
            />
          ))}
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}
