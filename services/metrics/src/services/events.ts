import { pool } from '../db/client';
import type { IngestEventRequest } from '@pushnami/shared/types';

export interface InsertEventResult {
  id: string;
  createdAt: string;
}

/**
 * Validate that a variant belongs to the given experiment.
 */
async function validateVariantBelongsToExperiment(
  experimentId: string,
  variantId: string,
): Promise<void> {
  const { rows } = await pool.query<{ id: string }>(
    `SELECT id FROM variants WHERE id = $1 AND experiment_id = $2`,
    [variantId, experimentId],
  );
  if (rows.length === 0) {
    const err = Object.assign(
      new Error(`Variant ${variantId} does not belong to experiment ${experimentId}`),
      { statusCode: 400 },
    );
    throw err;
  }
}

/**
 * Insert a single tracking event into the database.
 */
export async function insertEvent(
  event: IngestEventRequest,
): Promise<InsertEventResult> {
  await validateVariantBelongsToExperiment(event.experimentId, event.variantId);

  const { rows } = await pool.query<{ id: string; created_at: Date }>(
    `INSERT INTO events (visitor_id, experiment_id, variant_id, event_type, metadata)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, created_at`,
    [
      event.visitorId,
      event.experimentId,
      event.variantId,
      event.eventType,
      JSON.stringify(event.metadata ?? {}),
    ],
  );

  const row = rows[0];
  return { id: row.id, createdAt: row.created_at.toISOString() };
}

/**
 * Bulk-insert multiple tracking events using a single transaction.
 */
export async function insertEventBatch(
  events: IngestEventRequest[],
): Promise<{ count: number }> {
  if (events.length === 0) return { count: 0 };

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Validate all variant-experiment pairs
    for (const ev of events) {
      const check = await client.query<{ id: string }>(
        `SELECT id FROM variants WHERE id = $1 AND experiment_id = $2`,
        [ev.variantId, ev.experimentId],
      );
      if (check.rows.length === 0) {
        throw Object.assign(
          new Error(`Variant ${ev.variantId} does not belong to experiment ${ev.experimentId}`),
          { statusCode: 400 },
        );
      }
    }

    // Build multi-row INSERT with parameterized values
    const placeholders: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    for (const ev of events) {
      placeholders.push(`($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`);
      values.push(
        ev.visitorId,
        ev.experimentId,
        ev.variantId,
        ev.eventType,
        JSON.stringify(ev.metadata ?? {}),
      );
      idx += 5;
    }

    await client.query(
      `INSERT INTO events (visitor_id, experiment_id, variant_id, event_type, metadata)
       VALUES ${placeholders.join(', ')}`,
      values,
    );

    await client.query('COMMIT');
    return { count: events.length };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
