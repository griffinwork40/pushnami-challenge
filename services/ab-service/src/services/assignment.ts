import { createHash } from 'crypto';
import { query, withClient } from '../db/client.js';

// ─── Assignment Types ─────────────────────────────────────────────────────────

interface VariantRow {
  id: string;
  name: string;
  traffic_pct: number;
}

interface AssignmentResult {
  visitorId: string;
  experimentId: string;
  variantId: string;
  variantName: string;
}

// ─── Deterministic Hash Assignment ───────────────────────────────────────────

/**
 * SHA-256(visitorId:experimentId) → first 8 hex chars → integer → mod 100
 * Guarantees same visitor always maps to same bucket (0-99).
 */
function computeBucket(visitorId: string, experimentId: string): number {
  const hash = createHash('sha256')
    .update(`${visitorId}:${experimentId}`)
    .digest('hex');
  return parseInt(hash.slice(0, 8), 16) % 100;
}

/**
 * Map a 0-99 bucket to a variant using cumulative traffic percentages.
 * e.g., [50, 50] → bucket 0-49 → variant[0], bucket 50-99 → variant[1]
 */
function pickVariant(bucket: number, variants: VariantRow[]): VariantRow {
  let cumulative = 0;
  for (const variant of variants) {
    cumulative += variant.traffic_pct;
    if (bucket < cumulative) return variant;
  }
  // Fallback: last variant (handles floating-point edge cases)
  return variants[variants.length - 1]!;
}

// ─── Assignment Service ───────────────────────────────────────────────────────

export async function assignVisitor(
  visitorId: string,
  experimentId: string,
): Promise<AssignmentResult> {
  return withClient(async (client) => {
    // 1. Check for existing assignment (UNIQUE constraint on visitor+experiment)
    const existing = await client.query<{
      variant_id: string;
      variant_name: string;
    }>(
      `SELECT a.variant_id, v.name AS variant_name
       FROM assignments a
       JOIN variants v ON v.id = a.variant_id
       WHERE a.visitor_id = $1 AND a.experiment_id = $2`,
      [visitorId, experimentId],
    );

    if (existing.rows.length > 0) {
      const row = existing.rows[0]!;
      return {
        visitorId,
        experimentId,
        variantId: row.variant_id,
        variantName: row.variant_name,
      };
    }

    // 2. Check experiment exists and is active
    const expResult = await client.query<{ status: string }>(
      `SELECT status FROM experiments WHERE id = $1`,
      [experimentId],
    );

    if (expResult.rows.length === 0) {
      throw Object.assign(new Error('Experiment not found'), { statusCode: 404 });
    }

    if (expResult.rows[0]!.status !== 'active') {
      throw Object.assign(
        new Error(`Experiment is ${expResult.rows[0]!.status} — assignments only allowed for active experiments`),
        { statusCode: 409 },
      );
    }

    // 3. Load variants for this experiment (ordered for determinism)
    const variants = await client.query<VariantRow>(
      `SELECT id, name, traffic_pct
       FROM variants
       WHERE experiment_id = $1
       ORDER BY created_at ASC`,
      [experimentId],
    );

    if (variants.rows.length === 0) {
      throw Object.assign(new Error('Experiment has no variants'), { statusCode: 404 });
    }

    // 4. Deterministically pick variant
    const bucket = computeBucket(visitorId, experimentId);
    const chosen = pickVariant(bucket, variants.rows);

    // 5. Persist assignment (ON CONFLICT DO NOTHING handles race conditions)
    await client.query(
      `INSERT INTO assignments (visitor_id, experiment_id, variant_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (visitor_id, experiment_id) DO NOTHING`,
      [visitorId, experimentId, chosen.id],
    );

    // 6. Re-fetch in case of race (another request won the INSERT)
    const final = await client.query<{ variant_id: string; variant_name: string }>(
      `SELECT a.variant_id, v.name AS variant_name
       FROM assignments a
       JOIN variants v ON v.id = a.variant_id
       WHERE a.visitor_id = $1 AND a.experiment_id = $2`,
      [visitorId, experimentId],
    );

    const row = final.rows[0]!;
    return {
      visitorId,
      experimentId,
      variantId: row.variant_id,
      variantName: row.variant_name,
    };
  });
}
