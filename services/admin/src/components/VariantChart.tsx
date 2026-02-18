'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { ExperimentStats } from '@pushnami/shared/types';

interface Props {
  stats: ExperimentStats;
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function VariantChart({ stats }: Props) {
  const chartData = stats.variants.map((v) => ({
    name: v.variantName,
    'Unique Visitors': v.uniqueVisitors,
    'Total Events': v.totalEvents,
    'Conv. Rate %': parseFloat((v.conversionRate * 100).toFixed(2)),
  }));

  const eventBreakdownData = stats.variants.map((v) => ({
    name: v.variantName,
    ...Object.fromEntries(
      Object.entries(v.eventBreakdown).map(([k, val]) => [k.replace('_', ' '), val])
    ),
  }));

  const eventTypes = stats.variants.length > 0
    ? Object.keys(stats.variants[0].eventBreakdown).map((k) => k.replace('_', ' '))
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Main Metrics Chart */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Variant Performance</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} unit="%" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left"  dataKey="Unique Visitors" fill={COLORS[0]} radius={[4,4,0,0]} />
            <Bar yAxisId="left"  dataKey="Total Events"    fill={COLORS[1]} radius={[4,4,0,0]} />
            <Bar yAxisId="right" dataKey="Conv. Rate %"    fill={COLORS[2]} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Event Breakdown Chart */}
      {eventTypes.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Event Type Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={eventBreakdownData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {eventTypes.map((et, i) => (
                <Bar key={et} dataKey={et} fill={COLORS[i % COLORS.length]} radius={[4,4,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Conversion Rate Table */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Variant Summary</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Variant', 'Visitors', 'Events', 'Conv. Rate'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.variants.map((v, i) => (
              <tr key={v.variantId} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], marginRight: 8 }} />
                  {v.variantName}
                </td>
                <td style={{ padding: '10px 12px' }}>{v.uniqueVisitors.toLocaleString()}</td>
                <td style={{ padding: '10px 12px' }}>{v.totalEvents.toLocaleString()}</td>
                <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--blue)' }}>{(v.conversionRate * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
