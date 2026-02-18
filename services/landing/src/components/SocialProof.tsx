const TESTIMONIALS = [
  {
    quote:
      '"Pushnami increased our e-commerce revenue by 340% in the first quarter alone. The ROI is unreal."',
    author: 'Sarah Chen',
    role: 'VP Growth, ShopFlow',
    avatar: '👩‍💼',
  },
  {
    quote:
      '"We went from 2% to 18% click-through rates overnight. The smart segmentation is next-level."',
    author: 'Marcus Johnson',
    role: 'Head of Marketing, TechDaily',
    avatar: '👨‍💻',
  },
  {
    quote:
      '"Our app re-engagement campaigns now run themselves. We save 20+ hours a week and make more money."',
    author: 'Priya Patel',
    role: 'CEO, MobileFirst Inc.',
    avatar: '👩‍🚀',
  },
];

const LOGOS = ['Forbes', 'TechCrunch', 'Wired', 'Product Hunt', 'Fast Company'];

export default function SocialProof() {
  return (
    <section style={styles.section}>
      <div style={styles.logoBar}>
        <p style={styles.logoLabel}>AS SEEN IN</p>
        <div style={styles.logos}>
          {LOGOS.map((l) => (
            <span key={l} style={styles.logo}>{l}</span>
          ))}
        </div>
      </div>

      <h2 style={styles.heading}>Loved by growth teams worldwide</h2>
      <div style={styles.grid}>
        {TESTIMONIALS.map((t) => (
          <div key={t.author} style={styles.card}>
            <p style={styles.quote}>{t.quote}</p>
            <div style={styles.authorRow}>
              <span style={styles.avatar}>{t.avatar}</span>
              <div>
                <div style={styles.authorName}>{t.author}</div>
                <div style={styles.authorRole}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '64px 24px',
    maxWidth: '1100px',
    margin: '0 auto',
    textAlign: 'center',
  },
  logoBar: {
    marginBottom: '56px',
  },
  logoLabel: {
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    color: '#475569',
    marginBottom: '16px',
    fontWeight: 600,
  },
  logos: {
    display: 'flex',
    justifyContent: 'center',
    gap: '36px',
    flexWrap: 'wrap',
  },
  logo: {
    color: '#475569',
    fontWeight: 700,
    fontSize: '1rem',
    letterSpacing: '0.03em',
  },
  heading: {
    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
    fontWeight: 800,
    color: '#f1f5f9',
    marginBottom: '36px',
    letterSpacing: '-0.01em',
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
  },
  quote: {
    color: '#cbd5e1',
    lineHeight: 1.7,
    fontSize: '0.95rem',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    fontSize: '2rem',
  },
  authorName: {
    fontWeight: 700,
    color: '#e2e8f0',
    fontSize: '0.9rem',
  },
  authorRole: {
    color: '#64748b',
    fontSize: '0.8rem',
    marginTop: '2px',
  },
};
