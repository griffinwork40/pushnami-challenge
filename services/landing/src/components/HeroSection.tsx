import { tokens } from '@pushnami/shared';

interface HeroSectionProps {
  variantName: string;
}

const CONTENT = {
  control: {
    headline: 'Grow Your Business with Push Notifications',
    subtext:
      'Reach your audience at the right moment. Pushnami delivers intelligent push notifications that drive real engagement and measurable results.',
    badge: 'Trusted by 5,000+ businesses',
  },
  variant_a: {
    headline: '10x Your Revenue with Intelligent Push',
    subtext:
      'Stop leaving money on the table. Our AI-powered push notifications turn casual visitors into loyal customers — automatically.',
    badge: '🔥 Average 10x ROI in 90 days',
  },
};

export default function HeroSection({ variantName }: HeroSectionProps) {
  const content = variantName === 'variant_a' ? CONTENT.variant_a : CONTENT.control;

  return (
    <section style={styles.section}>
      <div style={styles.badge}>{content.badge}</div>
      <h1 style={styles.headline}>{content.headline}</h1>
      <p style={styles.subtext}>{content.subtext}</p>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    textAlign: 'center',
    padding: '80px 24px 40px',
    maxWidth: '760px',
    margin: '0 auto',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(99,102,241,0.15)',
    color: tokens.color.highlight.indigo,
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: tokens.radius.full,
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: tokens.space.lg,
    letterSpacing: '0.02em',
  },
  headline: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 800,
    lineHeight: 1.15,
    color: tokens.color.text.inverse,
    margin: '0 0 20px',
    letterSpacing: '-0.02em',
  },
  subtext: {
    fontSize: '1.15rem',
    color: tokens.color.text.inverseMuted,
    lineHeight: 1.7,
    maxWidth: '600px',
    margin: '0 auto',
  },
};
