import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { assignVariant, fetchExperiments, fetchToggles } from '@/lib/api';
import ClientPage from './client-page';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const cookieStore = await cookies();

  // Resolve or create visitor ID
  let visitorId = cookieStore.get('visitor_id')?.value;
  if (!visitorId) {
    visitorId = uuidv4();
  }

  // Fetch experiments to find the default one
  const experiments = await fetchExperiments();
  const experiment = experiments.find((e) =>
    e.name === 'Homepage Hero Test'
  ) ?? experiments[0] ?? null;

  // Parallel: assign variant + fetch toggles
  const [assignment, toggles] = await Promise.all([
    experiment ? assignVariant(visitorId, experiment.id) : Promise.resolve(null),
    fetchToggles(),
  ]);

  // Toggle map for easy lookup
  const toggleMap = Object.fromEntries(toggles.map((t) => [t.key, t.enabled]));

  const props = {
    visitorId,
    experimentId: experiment?.id ?? '',
    variantId: assignment?.variantId ?? '',
    variantName: assignment?.variantName ?? 'control',
    showHeroBanner: toggleMap['show_hero_banner'] ?? true,
    enableSocialProof: toggleMap['enable_social_proof'] ?? true,
    ctaStyleAggressive: toggleMap['cta_style_aggressive'] ?? false,
  };

  return (
    <>
      {/* Set cookie via meta refresh trick isn't possible — use response headers via middleware or simply set here */}
      <ClientPage {...props} />
    </>
  );
}
