import type { AssignVariantResponse, FeatureToggle } from '@pushnami/shared';

const AB_SERVICE_URL = process.env.AB_SERVICE_URL || 'http://localhost:3001';
const METRICS_SERVICE_URL = process.env.METRICS_SERVICE_URL || 'http://localhost:3002';

export { AB_SERVICE_URL, METRICS_SERVICE_URL };

export async function assignVariant(
  visitorId: string,
  experimentId: string
): Promise<AssignVariantResponse | null> {
  try {
    const res = await fetch(`${AB_SERVICE_URL}/api/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId, experimentId }),
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<AssignVariantResponse>;
  } catch {
    return null;
  }
}

export async function fetchToggles(): Promise<FeatureToggle[]> {
  try {
    const res = await fetch(`${AB_SERVICE_URL}/api/toggles`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json() as Promise<FeatureToggle[]>;
  } catch {
    return [];
  }
}

export async function fetchExperiments(): Promise<{ id: string; name: string }[]> {
  try {
    const res = await fetch(`${AB_SERVICE_URL}/api/experiments`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
