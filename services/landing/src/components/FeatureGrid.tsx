const FEATURES = [
  {
    icon: '⚡',
    title: 'Real-Time Delivery',
    desc: 'Push notifications delivered in milliseconds with 99.9% uptime SLA.',
  },
  {
    icon: '🎯',
    title: 'Smart Segmentation',
    desc: 'Target the right users at the right time with behavioral triggers.',
  },
  {
    icon: '📊',
    title: 'A/B Testing Built-In',
    desc: 'Automatically test and optimize every campaign for maximum ROI.',
  },
  {
    icon: '🤖',
    title: 'AI Personalization',
    desc: 'Machine learning adapts your messages to each individual user.',
  },
  {
    icon: '🌍',
    title: 'Global Scale',
    desc: 'Reach 500M+ subscribers across web, iOS, and Android.',
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    desc: 'SOC2 Type II certified. GDPR & CCPA compliant out of the box.',
  },
];

export default function FeatureGrid() {
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Everything you need to dominate push</h2>
      <p style={styles.sub}>One platform. Unlimited reach.</p>
      <div style={styles.grid}>
        {FEATURES.map((f) => (
          <div key={f.title} style={styles.card}>
            <div style={styles.icon}>{f.icon}</div>
            <h3 style={styles.cardTitle}>{f.title}</h3>
            <p style={styles.cardDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '72px 24px',
    maxWidth: '1100px',
    margin: '0 auto',
    textAlign: 'center',
  },
  heading: {
    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
    fontWeight: 800,
    color: '#f1f5f9',
    marginBottom: '12px',
    letterSpacing: '-0.01em',
  },
  sub: {
    color: '#64748b',
    marginBottom: '48px',
    fontSize: '1.05rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'rgba(30,41,59,0.7)',
    border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: '14px',
    padding: '28px 24px',
    textAlign: 'left',
    transition: 'border-color 0.2s',
  },
  icon: {
    fontSize: '2rem',
    marginBottom: '14px',
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#e2e8f0',
    marginBottom: '8px',
  },
  cardDesc: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: 1.6,
    margin: 0,
  },
};
