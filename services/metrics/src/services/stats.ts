import { pool } from '../db/client';
import type { ExperimentStats, VariantStats, EventType } from '@pushnami/shared/types';

// ─── Chi-Squared Statistics ──────────────────────────────────────────────────

/**
 * Lanczos approximation for log-gamma function.
 */
function logGamma(z: number): number {
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  }
  z -= 1;
  let a = p[0];
  const t = z + 7.5; // g = 7, t = z + g + 0.5
  for (let i = 1; i < 9; i++) a += p[i] / (z + i);
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}

/**
 * Regularized lower incomplete gamma P(a, x) via series expansion.
 */
function gammaIncP(a: number, x: number): number {
  if (x <= 0) return 0;
  let ap = a;
  let sum = 1 / a;
  let delta = sum;
  for (let i = 0; i < 300; i++) {
    ap++;
    delta *= x / ap;
    sum += delta;
    if (Math.abs(delta) < Math.abs(sum) * 1e-10) break;
  }
  return Math.exp(-x + a * Math.log(x) - logGamma(a)) * sum;
}

/**
 * Regularized upper incomplete gamma Q(a, x) via continued fraction.
 */
function gammaIncQ(a: number, x: number): number {
  let b = x + 1 - a;
  let c = 1 / 1e-30;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i <= 300; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = b + an / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-10) break;
  }
  return Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
}

/**
 * Two-tailed chi-squared p-value: P(X > chiSq) with given degrees of freedom.
 * Uses regularized incomplete gamma: p = 1 - P(df/2, chiSq/2)
 */
export function chiSquaredPValue(chiSq: number, df: number): number {
  if (chiSq <= 0 || df <= 0) return 1;
  const a = df / 2;
  const x = chiSq / 2;
  // Choose series vs continued-fraction based on x relative to a+1
  const cdf = x < a + 1 ? gammaIncP(a, x) : 1 - gammaIncQ(a, x);
  return Math.max(0, Math.min(1, 1 - cdf));
}

/**
 * Compute chi-squared statistic for conversion rates across variants.
 * Compares observed vs expected in a 2×k contingency table
 * (converted / not-converted × k variants).
 */
function computeChiSquared(
  variants: Array<{ conversions: number; visitors: number }>,
): number {
  const totalConversions = variants.reduce((s, v) => s + v.conversions, 0);
  const totalVisitors = variants.reduce((s, v) => s + v.visitors, 0);
  if (totalConversions === 0 || totalVisitors === 0) return 0;

  const pooledRate = totalConversions / totalVisitors;
  let chiSq = 0;

  for (const v of variants) {
    if (v.visitors === 0) continue;
    const expectedConv = pooledRate * v.visitors;
    const expectedNonConv = (1 - pooledRate) * v.visitors;
    const obsConv = v.conversions;
    const obsNonConv = v.visitors - v.conversions;

    if (expectedConv > 0) chiSq += (obsConv - expectedConv) ** 2 / expectedConv;
    if (expectedNonConv > 0) chiSq += (obsNonConv - expectedNonConv) ** 2 / expectedNonConv;
  }

  return chiSq;
}

// ─── DB Row Types ─────────────────────────────────────────────────────────────

interface VariantStatsRow {
  variant_id: string;
  variant_name: string;
  total_events: string;
  unique_visitors: string;
  page_view_count: string;
  click_count: string;
  form_submit_count: string;
  cta_click_count: string;
  scroll_depth_count: string;
  conversions: string;
}

// ─── Main Stats Query ─────────────────────────────────────────────────────────

export async function getExperimentStats(
  experimentId: string,
  startDate?: string,
  endDate?: string,
): Promise<ExperimentStats | null> {
  // Get experiment metadata
  const expResult = await pool.query<{ name: string }>(
    'SELECT name FROM experiments WHERE id = $1',
    [experimentId],
  );
  if (expResult.rows.length === 0) return null;
  const experimentName = expResult.rows[0].name;

  // Aggregate per-variant stats in one efficient query
  const { rows } = await pool.query<VariantStatsRow>(
    `SELECT
       e.variant_id,
       COALESCE(v.name, 'unknown') AS variant_name,
       COUNT(*)::text                                                     AS total_events,
       COUNT(DISTINCT e.visitor_id)::text                                 AS unique_visitors,
       COUNT(*) FILTER (WHERE e.event_type = 'page_view')::text          AS page_view_count,
       COUNT(*) FILTER (WHERE e.event_type = 'click')::text              AS click_count,
       COUNT(*) FILTER (WHERE e.event_type = 'form_submit')::text        AS form_submit_count,
       COUNT(*) FILTER (WHERE e.event_type = 'cta_click')::text         AS cta_click_count,
       COUNT(*) FILTER (WHERE e.event_type = 'scroll_depth')::text      AS scroll_depth_count,
       COUNT(DISTINCT CASE
         WHEN e.event_type IN ('cta_click', 'form_submit') THEN e.visitor_id
       END)::text                                                         AS conversions
     FROM events e
     LEFT JOIN variants v ON v.id = e.variant_id
     WHERE e.experiment_id = $1
       AND ($2::timestamptz IS NULL OR e.created_at >= $2::timestamptz)
       AND ($3::timestamptz IS NULL OR e.created_at <= $3::timestamptz)
     GROUP BY e.variant_id, v.name`,
    [experimentId, startDate ?? null, endDate ?? null],
  );

  const variants: VariantStats[] = rows.map((row) => {
    const uniqueVisitors = parseInt(row.unique_visitors, 10);
    const conversions = parseInt(row.conversions, 10);
    return {
      variantId: row.variant_id,
      variantName: row.variant_name,
      totalEvents: parseInt(row.total_events, 10),
      uniqueVisitors,
      eventBreakdown: {
        page_view: parseInt(row.page_view_count, 10),
        click: parseInt(row.click_count, 10),
        form_submit: parseInt(row.form_submit_count, 10),
        cta_click: parseInt(row.cta_click_count, 10),
        scroll_depth: parseInt(row.scroll_depth_count, 10),
      } as Record<EventType, number>,
      conversionRate: uniqueVisitors > 0 ? conversions / uniqueVisitors : 0,
    };
  });

  const totalVisitors = variants.reduce((s, v) => s + v.uniqueVisitors, 0);

  // Statistical significance via chi-squared test
  let confidence: number | null = null;
  let significanceReached = false;

  if (variants.length >= 2) {
    const chiSqInput = rows.map((row) => ({
      conversions: parseInt(row.conversions, 10),
      visitors: parseInt(row.unique_visitors, 10),
    }));
    const chiSq = computeChiSquared(chiSqInput);
    const df = variants.length - 1;
    confidence = chiSquaredPValue(chiSq, df);
    significanceReached = confidence < 0.05;
  }

  return {
    experimentId,
    experimentName,
    totalVisitors,
    variants,
    confidence,
    significanceReached,
  };
}
