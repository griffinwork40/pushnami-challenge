// ─── Service Configuration ───────────────────────────────────────────────────

export const SERVICES = {
  AB_SERVICE: { port: 3001, name: 'ab-service' },
  METRICS: { port: 3002, name: 'metrics-service' },
  LANDING: { port: 3000, name: 'landing-page' },
  ADMIN: { port: 3003, name: 'admin-app' },
} as const;

// Internal Docker network URLs (service-to-service)
export const INTERNAL_URLS = {
  AB_SERVICE: `http://ab-service:${SERVICES.AB_SERVICE.port}`,
  METRICS: `http://metrics:${SERVICES.METRICS.port}`,
} as const;

// ─── Default Feature Toggles ────────────────────────────────────────────────

export const DEFAULT_TOGGLES = [
  { key: 'show_hero_banner', enabled: true, description: 'Display hero banner section on landing page' },
  { key: 'enable_social_proof', enabled: true, description: 'Show social proof / testimonials section' },
  { key: 'cta_style_aggressive', enabled: false, description: 'Use aggressive CTA copy and styling' },
] as const;

// ─── Default Experiment ──────────────────────────────────────────────────────

export const DEFAULT_EXPERIMENT = {
  name: 'Homepage Hero Test',
  description: 'Test different hero section messaging for conversion optimization',
  variants: [
    { name: 'control', description: 'Original hero messaging' },
    { name: 'variant_a', description: 'Benefits-focused messaging' },
  ],
  trafficSplit: [50, 50],
} as const;

export const VERSION = '1.0.0';
