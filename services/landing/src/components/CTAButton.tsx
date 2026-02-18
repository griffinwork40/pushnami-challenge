'use client';

interface CTAButtonProps {
  aggressive: boolean;
  onClick: () => void;
}

export default function CTAButton({ aggressive, onClick }: CTAButtonProps) {
  return (
    <div style={styles.wrapper}>
      {aggressive && (
        <div style={styles.urgency}>⚡ Limited Time — 30-Day Free Trial</div>
      )}
      <button
        onClick={onClick}
        style={aggressive ? styles.btnAggressive : styles.btnCalm}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.opacity = '0.88';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.opacity = '1';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        }}
      >
        {aggressive ? 'Claim Your Free Trial Now →' : 'Get Started for Free →'}
      </button>
      <p style={styles.sub}>No credit card required · Cancel anytime</p>
    </div>
  );
}

const baseBtn: React.CSSProperties = {
  display: 'inline-block',
  padding: '16px 40px',
  borderRadius: '10px',
  border: 'none',
  fontSize: '1.05rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'opacity 0.15s, transform 0.15s',
  letterSpacing: '0.01em',
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    textAlign: 'center',
    padding: '16px 0 8px',
  },
  urgency: {
    color: '#f97316',
    fontWeight: 700,
    fontSize: '0.9rem',
    marginBottom: '12px',
    letterSpacing: '0.02em',
  },
  btnCalm: {
    ...baseBtn,
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#fff',
    boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
  },
  btnAggressive: {
    ...baseBtn,
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#fff',
    boxShadow: '0 4px 24px rgba(239,68,68,0.45)',
  },
  sub: {
    marginTop: '12px',
    color: '#64748b',
    fontSize: '0.82rem',
  },
};
