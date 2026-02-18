'use client';

import type { ExperimentStats } from '@pushnami/shared/types';
import { tokens } from '@pushnami/shared';

interface Props {
  stats: ExperimentStats[];
}

interface StatCard {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export default function StatsOverview({ stats }: Props) {
  const totalVisitors = stats.reduce((sum, s) => sum + s.totalVisitors, 0);
  const totalEvents = stats.reduce((sum, s) =>
    sum + s.variants.reduce((vs, v) => vs + v.totalEvents, 0), 0);
  const avgConversion = stats.length === 0 ? 0 :
    stats.reduce((sum, s) => {
      const avg = s.variants.reduce((vs, v) => vs + v.conversionRate, 0) / (s.variants.length || 1);
      return sum + avg;
    }, 0) / stats.length;

  const cards: StatCard[] = [
    { label: 'Total Visitors',    value: totalVisitors.toLocaleString(), icon: '👥', color: tokens.color.status.infoBg },
    { label: 'Total Events',      value: totalEvents.toLocaleString(),   icon: '📈', color: tokens.color.status.successBg },
    { label: 'Avg Conversion',    value: `${(avgConversion * 100).toFixed(2)}%`, icon: '🎯', color: tokens.color.status.warningBg },
    { label: 'Active Experiments', value: String(stats.length),          icon: '🧪', color: '#fae8ff' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
      {cards.map((c) => (
        <div key={c.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48,
            borderRadius: parseInt(tokens.radius.lg),
            background: c.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem',
            flexShrink: 0,
          }}>
            {c.icon}
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
