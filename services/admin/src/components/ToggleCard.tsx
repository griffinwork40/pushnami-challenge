'use client';

import type { FeatureToggle } from '@pushnami/shared/types';

interface Props {
  toggle: FeatureToggle;
  onToggle: (id: string, enabled: boolean) => void;
  updating: boolean;
}

export default function ToggleCard({ toggle, onToggle, updating }: Props) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontWeight: 600, fontSize: '.95rem' }}>{toggle.key}</span>
          <span className={`badge ${toggle.enabled ? 'badge-green' : 'badge-gray'}`}>
            {toggle.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <div style={{ fontSize: '.85rem', color: 'var(--text-secondary)' }}>{toggle.description}</div>
        <div style={{ fontSize: '.75rem', color: '#94a3b8', marginTop: 4 }}>
          Last updated: {new Date(toggle.updatedAt).toLocaleString()}
        </div>
      </div>

      {/* Toggle Switch */}
      <button
        onClick={() => onToggle(toggle.id, !toggle.enabled)}
        disabled={updating}
        aria-label={toggle.enabled ? 'Disable toggle' : 'Enable toggle'}
        style={{
          position: 'relative',
          width: 52,
          height: 28,
          borderRadius: 14,
          border: 'none',
          background: toggle.enabled ? 'var(--green)' : '#cbd5e1',
          cursor: updating ? 'not-allowed' : 'pointer',
          transition: 'background .2s',
          flexShrink: 0,
          opacity: updating ? 0.6 : 1,
        }}
      >
        <span style={{
          position: 'absolute',
          top: 3,
          left: toggle.enabled ? 26 : 3,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,.2)',
          transition: 'left .2s',
        }} />
      </button>
    </div>
  );
}
