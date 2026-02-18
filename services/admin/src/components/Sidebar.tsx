'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { tokens } from '@pushnami/shared';

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
      background: tokens.color.surface.sidebar,
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      overflowY: 'auto',
    }}>
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: `1px solid ${tokens.color.surface.sidebarHover}`,
      }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: tokens.color.text.inverse, letterSpacing: '-.01em' }}>
          🚀 Pushnami
        </div>
        <div style={{ fontSize: '.75rem', color: tokens.color.text.secondary, marginTop: 2 }}>Admin Dashboard</div>
      </div>

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
                color: active ? tokens.color.text.inverse : tokens.color.text.inverseMuted,
                background: active ? tokens.color.surface.sidebarHover : 'transparent',
                borderLeft: active ? `3px solid ${tokens.color.brand.primary}` : '3px solid transparent',
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

      <div style={{
        padding: '16px 20px',
        borderTop: `1px solid ${tokens.color.surface.sidebarHover}`,
        fontSize: '.75rem',
        color: tokens.color.text.secondary,
      }}>
        v1.0.0
      </div>
    </aside>
  );
}
