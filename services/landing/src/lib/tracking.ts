import type { EventType } from '@pushnami/shared';

export interface TrackEventPayload {
  visitorId: string;
  experimentId: string;
  variantId: string;
  eventType: EventType;
  metadata?: Record<string, unknown>;
}

/** Fire-and-forget client-side event tracker */
export async function trackEvent(payload: TrackEventPayload): Promise<void> {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Non-blocking — silently fail
  }
}

/** Set up scroll-depth tracking (fires once at 50%) */
export function setupScrollTracking(
  onScrollDepth: () => void
): () => void {
  let fired = false;

  const handler = () => {
    if (fired) return;
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.documentElement.scrollHeight;
    if (scrolled / total >= 0.5) {
      fired = true;
      onScrollDepth();
    }
  };

  window.addEventListener('scroll', handler, { passive: true });
  return () => window.removeEventListener('scroll', handler);
}
