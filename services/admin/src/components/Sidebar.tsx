'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/stats',       label: 'Stats Dashboard', icon: '📊' },
  { href: '/toggles',     label: 'Feature Toggles', icon: '🔄' },
  { href: '/experiments', label: 'Experiments',      icon: '🧪' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 240,
      minWidth: 240,
      background: '#1e293b',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      overflowY: 'auto',
    }}>
      {/* Brand */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid #334155',
      }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-.01em' }}>
          🚀 Pushnami
        </div>
        <div style={{ fontSize: '.75rem', color: '#64748b', marginTop: 2 }}>Admin Dashboard</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 20px',
                textDecoration: 'none',
                color: active ? '#f1f5f9' : '#94a3b8',
                background: active ? '#2d3f55' : 'transparent',
                borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
                fontSize: '.9rem',
                fontWeight: active ? 600 : 400,
                transition: 'all .15s',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #334155',
        fontSize: '.75rem',
        color: '#475569',
      }}>
        v1.0.0
      </div>
    </aside>
  );
}
