'use client';

import { useState, useEffect, useCallback } from 'react';
import StatsOverview from '../../components/StatsOverview';
import VariantChart from '../../components/VariantChart';
import SignificanceBadge from '../../components/SignificanceBadge';
import { fetchStats } from '../../lib/api';
import type { ExperimentStats } from '@pushnami/shared/types';

const REFRESH_INTERVAL = 30_000;

export default function StatsPage() {
  const [stats, setStats]     = useState<ExperimentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchStats();
      // Handle both array and single-object responses
      setStats(Array.isArray(data) ? data : [data]);
      setError(null);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [load]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Stats Dashboard</h1>
          {lastUpdated && (
            <div style={{ fontSize: '.8rem', color: 'var(--text-secondary)' }}>
              Last updated: {lastUpdated.toLocaleTimeString()} · Auto-refreshes every 30s
            </div>
          )}
        </div>
        <button className="btn btn-secondary btn-sm" onClick={load}>↻ Refresh Now</button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /> Loading stats…</div>
      ) : stats.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 48 }}>
          No experiment stats available yet.
        </div>
      ) : (
        <>
          <StatsOverview stats={stats} />

          {stats.map((s) => (
            <div key={s.experimentId} style={{ marginBottom: 32 }}>
              {/* Experiment Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{s.experimentName}</h2>
                <SignificanceBadge
                  significanceReached={s.significanceReached}
                  confidence={s.confidence}
                />
              </div>

              {/* Charts */}
              {s.variants.length > 0 ? (
                <VariantChart stats={s} />
              ) : (
                <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 32 }}>
                  No variant data available yet.
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
