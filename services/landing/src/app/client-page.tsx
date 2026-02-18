'use client';

import { useEffect, useRef, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import FeatureGrid from '@/components/FeatureGrid';
import SocialProof from '@/components/SocialProof';
import CTAButton from '@/components/CTAButton';
import { trackEvent, setupScrollTracking } from '@/lib/tracking';
import { tokens } from '@pushnami/shared';

interface ClientPageProps {
  visitorId: string;
  experimentId: string;
  variantId: string;
  variantName: string;
  showHeroBanner: boolean;
  enableSocialProof: boolean;
  ctaStyleAggressive: boolean;
}

export default function ClientPage({
  visitorId,
  experimentId,
  variantId,
  variantName,
  showHeroBanner,
  enableSocialProof,
  ctaStyleAggressive,
}: ClientPageProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const trackedPageView = useRef(false);

  const ctx = { visitorId, experimentId, variantId };

  useEffect(() => {
    if (trackedPageView.current || !experimentId) return;
    trackedPageView.current = true;
    trackEvent({ ...ctx, eventType: 'page_view', metadata: { variantName } });

    const cleanup = setupScrollTracking(() => {
      trackEvent({ ...ctx, eventType: 'scroll_depth', metadata: { depth: 50 } });
    });
    return cleanup;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentId]);

  function handleCTAClick() {
    trackEvent({ ...ctx, eventType: 'cta_click' });
    document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    trackEvent({ ...ctx, eventType: 'form_submit', metadata: { email } });
    setSubmitted(true);
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.logo}>Pushnami</span>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#testimonials" style={styles.navLink}>Testimonials</a>
          <a href="#newsletter" style={styles.navLink}>Get Started</a>
        </div>
      </nav>

      {showHeroBanner && <HeroSection variantName={variantName} />}

      <div style={{ textAlign: 'center', paddingBottom: tokens.space['2xl'] }}>
        <CTAButton aggressive={ctaStyleAggressive} onClick={handleCTAClick} />
        {experimentId && (
          <p style={styles.variantTag}>
            Variant: <code style={styles.code}>{variantName}</code>
          </p>
        )}
      </div>

      <div style={styles.statsBar}>
        {[['500M+', 'Subscribers reached'], ['99.9%', 'Uptime SLA'], ['10x', 'Average ROI'], ['5,000+', 'Happy customers']].map(([val, label]) => (
          <div key={label} style={styles.stat}>
            <span style={styles.statVal}>{val}</span>
            <span style={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      <div id="features"><FeatureGrid /></div>

      {enableSocialProof && (
        <div id="testimonials"><SocialProof /></div>
      )}

      <section id="newsletter" style={styles.newsletter}>
        <h2 style={styles.nlHeading}>Ready to grow? Start free today.</h2>
        <p style={styles.nlSub}>Join 5,000+ businesses already using Pushnami.</p>
        {submitted ? (
          <div style={styles.successBox}>
            ✅ You&apos;re on the list! We&apos;ll be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} style={styles.form}>
            <input
              type="email"
              required
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.submitBtn}>
              {ctaStyleAggressive ? 'Claim My Free Trial →' : 'Get Early Access →'}
            </button>
          </form>
        )}
      </section>

      <footer style={styles.footer}>
        <p>© 2026 Pushnami, Inc. · Privacy · Terms</p>
      </footer>
    </div>
  );
}

// ─── Styles (all colors via design tokens) ────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', color: tokens.color.border.default },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 40px',
    borderBottom: `1px solid ${tokens.color.border.dark}`,
    background: 'rgba(15,23,42,0.95)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(8px)',
  },
  logo: {
    fontSize: '1.4rem',
    fontWeight: 800,
    background: `linear-gradient(135deg, ${tokens.color.brand.accent}, #a78bfa)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
  },
  navLinks: { display: 'flex', gap: '28px' },
  navLink: {
    color: tokens.color.text.inverseMuted,
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  variantTag: {
    marginTop: tokens.space.md,
    fontSize: '0.75rem',
    color: tokens.color.border.dark,
  },
  code: {
    background: 'rgba(99,102,241,0.1)',
    color: tokens.color.brand.accent,
    padding: '2px 6px',
    borderRadius: tokens.radius.sm,
    fontSize: '0.75rem',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: tokens.space['2xl'],
    flexWrap: 'wrap' as const,
    padding: `${tokens.space.xl} ${tokens.space.lg}`,
    borderTop: `1px solid ${tokens.color.border.dark}`,
    borderBottom: `1px solid ${tokens.color.border.dark}`,
    background: 'rgba(30,41,59,0.4)',
  },
  stat: { textAlign: 'center' as const },
  statVal: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: 800,
    color: '#a5b4fc',
    letterSpacing: '-0.02em',
  },
  statLabel: { fontSize: '0.8rem', color: tokens.color.text.secondary },
  newsletter: {
    textAlign: 'center' as const,
    padding: '80px 24px',
    background: 'rgba(30,41,59,0.5)',
    borderTop: `1px solid ${tokens.color.border.dark}`,
  },
  nlHeading: {
    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
    fontWeight: 800,
    color: tokens.color.text.inverse,
    marginBottom: '12px',
  },
  nlSub: { color: tokens.color.text.secondary, marginBottom: tokens.space.xl },
  form: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
    maxWidth: '480px',
    margin: '0 auto',
  },
  input: {
    flex: 1,
    minWidth: '220px',
    padding: '14px 18px',
    borderRadius: tokens.radius.md,
    border: `1px solid ${tokens.color.border.dark}`,
    background: 'rgba(15,23,42,0.9)',
    color: tokens.color.border.default,
    fontSize: '0.95rem',
    outline: 'none',
  },
  submitBtn: {
    padding: '14px 28px',
    borderRadius: tokens.radius.md,
    border: 'none',
    background: `linear-gradient(135deg, ${tokens.color.brand.accent}, ${tokens.color.brand.accentHover})`,
    color: tokens.color.text.inverse,
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  },
  successBox: {
    display: 'inline-block',
    padding: '16px 32px',
    background: tokens.color.status.successBg,
    border: `1px solid ${tokens.color.status.successBorder}`,
    borderRadius: tokens.radius.lg,
    color: tokens.color.status.success,
    fontWeight: 600,
  },
  footer: {
    textAlign: 'center' as const,
    padding: '28px 24px',
    color: tokens.color.border.dark,
    fontSize: '0.8rem',
    borderTop: `1px solid ${tokens.color.border.dark}`,
  },
};
