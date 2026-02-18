'use client';

import type { Experiment } from '@pushnami/shared/types';
import { tokens } from '@pushnami/shared';

interface Props {
  experiment: Experiment;
  onUpdate: (id: string, status: 'active' | 'paused' | 'completed') => void;
  updating: boolean;
}

const STATUS_BADGE: Record<string, string> = {
  active:    'badge-green',
  paused:    'badge-yellow',
  completed: 'badge-gray',
};

export default function ExperimentPanel({ experiment, onUpdate, updating }: Props) {
  const canPause   = experiment.status === 'active';
  const canResume  = experiment.status === 'paused';
  const canComplete = experiment.status !== 'completed';

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{experiment.name}</h3>
            <span className={`badge ${STATUS_BADGE[experiment.status] || 'badge-gray'}`}>
              {experiment.status}
            </span>
          </div>
          <p style={{ fontSize: '.85rem', color: 'var(--text-secondary)' }}>{experiment.description}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {canPause && (
            <button className="btn btn-sm btn-secondary" disabled={updating} onClick={() => onUpdate(experiment.id, 'paused')}>
              ⏸ Pause
            </button>
          )}
          {canResume && (
            <button className="btn btn-sm btn-success" disabled={updating} onClick={() => onUpdate(experiment.id, 'active')}>
              ▶ Resume
            </button>
          )}
          {canComplete && (
            <button className="btn btn-sm btn-danger" disabled={updating} onClick={() => onUpdate(experiment.id, 'completed')}>
              ✓ Complete
            </button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Variants & Traffic Split
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {experiment.variants.map((v, i) => {
            const split = experiment.trafficSplit[i] ?? 0;
            return (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 80, fontSize: '.85rem', fontWeight: 500 }}>{v.name}</div>
                <div style={{ flex: 1, height: 8, background: tokens.color.border.subtle, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${split}%`, height: '100%', background: i === 0 ? tokens.color.brand.primary : tokens.color.status.success, borderRadius: 4, transition: 'width .3s' }} />
                </div>
                <div style={{ width: 36, fontSize: '.8rem', color: 'var(--text-secondary)', textAlign: 'right' as const }}>{split}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, fontSize: '.75rem', color: tokens.color.text.muted, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
        <span>ID: {experiment.id.slice(0, 8)}…</span>
        <span>Created: {new Date(experiment.createdAt).toLocaleDateString()}</span>
        <span>Updated: {new Date(experiment.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
