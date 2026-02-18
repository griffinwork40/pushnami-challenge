'use client';

import { tokens } from '@pushnami/shared';

interface Props {
  significanceReached: boolean;
  confidence: number | null;
}

export default function SignificanceBadge({ significanceReached, confidence }: Props) {
  const pValue = confidence !== null ? confidence : null;

  if (significanceReached) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: tokens.color.status.successBg,
        border: `1px solid ${tokens.color.status.successBorder}`,
        borderRadius: parseInt(tokens.radius.md),
        padding: '8px 14px',
      }}>
        <span style={{ fontSize: '1rem' }}>✅</span>
        <div>
          <div style={{ fontWeight: 600, color: tokens.color.status.success, fontSize: '.875rem' }}>
            Statistically Significant (p &lt; 0.05)
          </div>
          {pValue !== null && (
            <div style={{ fontSize: '.75rem', color: tokens.color.status.success }}>
              p-value: {pValue.toFixed(4)} · Confidence: {((1 - pValue) * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: tokens.color.status.warningBg,
      border: `1px solid ${tokens.color.status.warningBorder}`,
      borderRadius: parseInt(tokens.radius.md),
      padding: '8px 14px',
    }}>
      <span style={{ fontSize: '1rem' }}>⏳</span>
      <div>
        <div style={{ fontWeight: 600, color: tokens.color.status.warning, fontSize: '.875rem' }}>
          Not yet significant{pValue !== null ? ` (p = ${pValue.toFixed(4)})` : ''} — need more data
        </div>
        {pValue !== null && (
          <div style={{ fontSize: '.75rem', color: tokens.color.status.warning }}>
            Current confidence: {((1 - pValue) * 100).toFixed(1)}% (need ≥ 95%)
          </div>
        )}
      </div>
    </div>
  );
}
