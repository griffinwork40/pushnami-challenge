'use client';

import { useEffect, useRef, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import FeatureGrid from '@/components/FeatureGrid';
import SocialProof from '@/components/SocialProof';
import CTAButton from '@/components/CTAButton';
import { trackEvent, setupScrollTracking } from '@/lib/tracking';

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
    // Scroll to newsletter form
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
      {/* Nav */}
      <nav style={styles.nav}>
        <span style={styles.logo}>Pushnami</span>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#testimonials" style={styles.navLink}>Testimonials</a>
          <a href="#newsletter" style={styles.navLink}>Get Started</a>
        </div>
      </nav>

      {/* Hero */}
      {showHeroBanner && <HeroSection variantName={variantName} />}

      {/* Primary CTA */}
      <div style={{ textAlign: 'center', paddingBottom: '48px' }}>
        <CTAButton aggressive={ctaStyleAggressive} onClick={handleCTAClick} />
        {experimentId && (
          <p style={styles.variantTag}>
            Variant: <code style={styles.code}>{variantName}</code>
          </p>
        )}
      </div>

      {/* Stats bar */}
      <div style={styles.statsBar}>
        {[['500M+', 'Subscribers reached'], ['99.9%', 'Uptime SLA'], ['10x', 'Average ROI'], ['5,000+', 'Happy customers']].map(([val, label]) => (
          <div key={label} style={styles.stat}>
            <span style={styles.statVal}>{val}</span>
            <span style={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* Features */}
      <div id="features"><FeatureGrid /></div>

      {/* Social Proof */}
      {enableSocialProof && (
        <div id="testimonials"><SocialProof /></div>
      )}

      {/* Newsletter / Email CTA */}
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

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 Pushnami, Inc. · Privacy · Terms</p>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', color: '#e2e8f0' },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 40px',
    borderBottom: '1px solid rgba(99,102,241,0.15)',
    background: 'rgba(15,23,42,0.95)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(8px)',
  },
  logo: {
    fontSize: '1.4rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
  },
  navLinks: { display: 'flex', gap: '28px' },
  navLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  variantTag: {
    marginTop: '16px',
    fontSize: '0.75rem',
    color: '#334155',
  },
  code: {
    background: 'rgba(99,102,241,0.1)',
    color: '#818cf8',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.75rem',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '48px',
    flexWrap: 'wrap' as const,
    padding: '32px 24px',
    borderTop: '1px solid rgba(99,102,241,0.1)',
    borderBottom: '1px solid rgba(99,102,241,0.1)',
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
  statLabel: { fontSize: '0.8rem', color: '#64748b' },
  newsletter: {
    textAlign: 'center' as const,
    padding: '80px 24px',
    background: 'rgba(30,41,59,0.5)',
    borderTop: '1px solid rgba(99,102,241,0.15)',
  },
  nlHeading: {
    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
    fontWeight: 800,
    color: '#f1f5f9',
    marginBottom: '12px',
  },
  nlSub: { color: '#64748b', marginBottom: '32px' },
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
    borderRadius: '8px',
    border: '1px solid rgba(99,102,241,0.3)',
    background: 'rgba(15,23,42,0.9)',
    color: '#e2e8f0',
    fontSize: '0.95rem',
    outline: 'none',
  },
  submitBtn: {
    padding: '14px 28px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  },
  successBox: {
    display: 'inline-block',
    padding: '16px 32px',
    background: 'rgba(16,185,129,0.1)',
    border: '1px solid rgba(16,185,129,0.3)',
    borderRadius: '10px',
    color: '#6ee7b7',
    fontWeight: 600,
  },
  footer: {
    textAlign: 'center' as const,
    padding: '28px 24px',
    color: '#334155',
    fontSize: '0.8rem',
    borderTop: '1px solid rgba(99,102,241,0.1)',
  },
};
