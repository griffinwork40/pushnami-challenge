'use client';

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
        background: '#dcfce7',
        border: '1px solid #86efac',
        borderRadius: 8,
        padding: '8px 14px',
      }}>
        <span style={{ fontSize: '1rem' }}>✅</span>
        <div>
          <div style={{ fontWeight: 600, color: '#15803d', fontSize: '.875rem' }}>
            Statistically Significant (p &lt; 0.05)
          </div>
          {pValue !== null && (
            <div style={{ fontSize: '.75rem', color: '#166534' }}>
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
      background: '#fefce8',
      border: '1px solid #fde047',
      borderRadius: 8,
      padding: '8px 14px',
    }}>
      <span style={{ fontSize: '1rem' }}>⏳</span>
      <div>
        <div style={{ fontWeight: 600, color: '#854d0e', fontSize: '.875rem' }}>
          Not yet significant{pValue !== null ? ` (p = ${pValue.toFixed(4)})` : ''} — need more data
        </div>
        {pValue !== null && (
          <div style={{ fontSize: '.75rem', color: '#92400e' }}>
            Current confidence: {((1 - pValue) * 100).toFixed(1)}% (need ≥ 95%)
          </div>
        )}
      </div>
    </div>
  );
}
