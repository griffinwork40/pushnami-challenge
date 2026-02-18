// ─── Semantic Design Tokens ──────────────────────────────────────────────────
// Single source of truth for all color values across landing + admin.
// Components reference tokens by role, never raw hex.

export const tokens = {
  color: {
    // ─── Brand ────────────────────────────────────────────────────────
    brand: {
      primary: '#3b82f6',       // Blue-500 — primary actions, links
      primaryHover: '#2563eb',  // Blue-600
      primaryMuted: '#1d4ed8',  // Blue-700
      accent: '#6366f1',        // Indigo-500 — highlights, badges
      accentHover: '#4f46e5',   // Indigo-600
    },

    // ─── Surfaces ─────────────────────────────────────────────────────
    surface: {
      page: '#f8fafc',          // Slate-50 — admin page background
      card: '#ffffff',          // White — card backgrounds
      cardHover: '#f1f5f9',     // Slate-100
      sidebar: '#1e293b',       // Slate-800 — admin sidebar
      sidebarHover: '#334155',  // Slate-700
      dark: '#0f172a',          // Slate-900 — landing page background
      darkElevated: '#1e293b',  // Slate-800 — landing cards
      overlay: 'rgba(0,0,0,0.5)',
    },

    // ─── Text ─────────────────────────────────────────────────────────
    text: {
      primary: '#0f172a',       // Slate-900 — headings on light bg
      secondary: '#475569',     // Slate-600 — body text
      muted: '#94a3b8',         // Slate-400 — placeholders, captions
      inverse: '#f8fafc',       // Slate-50 — text on dark bg
      inverseMuted: '#94a3b8',  // Slate-400 — muted text on dark bg
      link: '#3b82f6',          // Blue-500
      linkHover: '#2563eb',     // Blue-600
    },

    // ─── Borders ──────────────────────────────────────────────────────
    border: {
      default: '#e2e8f0',       // Slate-200
      subtle: '#f1f5f9',        // Slate-100
      focus: '#3b82f6',         // Blue-500
      dark: '#334155',          // Slate-700 — borders on dark bg
    },

    // ─── Semantic / Status ────────────────────────────────────────────
    status: {
      success: '#22c55e',       // Green-500
      successBg: '#f0fdf4',     // Green-50
      successBorder: '#bbf7d0', // Green-200
      warning: '#eab308',       // Yellow-500
      warningBg: '#fefce8',     // Yellow-50
      warningBorder: '#fde68a', // Yellow-200
      error: '#ef4444',         // Red-500
      errorBg: '#fef2f2',       // Red-50
      errorBorder: '#fecaca',   // Red-200
      info: '#3b82f6',          // Blue-500
      infoBg: '#eff6ff',        // Blue-50
    },

    // ─── CTA Variants ─────────────────────────────────────────────────
    cta: {
      calm: '#3b82f6',          // Blue-500
      calmHover: '#2563eb',     // Blue-600
      aggressive: '#ef4444',    // Red-500
      aggressiveHover: '#dc2626', // Red-600
      aggressivePulse: 'rgba(239,68,68,0.3)',
    },

    // ─── Chart / Misc ─────────────────────────────────────────────────
    chart: {
      cyan: '#06b6d4',         // Cyan-500 — chart palette fallback
    },
    highlight: {
      indigo: '#a5b4fc',       // Indigo-300 — stat values, badges on dark
      violet: '#a78bfa',       // Violet-400 — gradient accents
      orange: '#f97316',       // Orange-500 — urgency accent
      fuchsia: '#fae8ff',      // Fuchsia-100 — experiment card bg
    },
  },

  // ─── Shadows ──────────────────────────────────────────────────────────
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
    card: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    glow: '0 0 20px rgba(99,102,241,0.3)',
  },

  // ─── Radii ────────────────────────────────────────────────────────────
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // ─── Spacing Scale ────────────────────────────────────────────────────
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
} as const;

export type Tokens = typeof tokens;
