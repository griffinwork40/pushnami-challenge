import { withClient, query } from '../db/client.js';
import type { Experiment, FeatureToggle } from '@pushnami/shared/types';

// ─── Experiment Service ───────────────────────────────────────────────────────

interface CreateExperimentInput {
  name: string;
  description: string;
  variants: { name: string; description?: string }[];
  trafficSplit: number[];
}

interface UpdateExperimentInput {
  name?: string;
  description?: string;
  status?: 'active' | 'paused' | 'completed';
  trafficSplit?: number[];
}

function rowToExperiment(exp: Record<string, unknown>, variants: Record<string, unknown>[]): Experiment {
  return {
    id: exp.id as string,
    name: exp.name as string,
    description: exp.description as string,
    status: exp.status as Experiment['status'],
    createdAt: exp.created_at as string,
    updatedAt: exp.updated_at as string,
    variants: variants.map((v) => ({
      id: v.id as string,
      name: v.name as string,
      description: v.description as string | undefined,
    })),
    trafficSplit: variants.map((v) => v.traffic_pct as number),
  };
}

export async function listExperiments(): Promise<Experiment[]> {
  const exps = await query<Record<string, unknown>>(
    `SELECT * FROM experiments ORDER BY created_at DESC`,
  );
  const results: Experiment[] = [];
  for (const exp of exps) {
    const variants = await query<Record<string, unknown>>(
      `SELECT * FROM variants WHERE experiment_id = $1 ORDER BY created_at ASC`,
      [exp.id as string],
    );
    results.push(rowToExperiment(exp, variants));
  }
  return results;
}

export async function getExperiment(id: string): Promise<Experiment | null> {
  const exps = await query<Record<string, unknown>>(
    `SELECT * FROM experiments WHERE id = $1`,
    [id],
  );
  if (exps.length === 0) return null;
  const variants = await query<Record<string, unknown>>(
    `SELECT * FROM variants WHERE experiment_id = $1 ORDER BY created_at ASC`,
    [id],
  );
  return rowToExperiment(exps[0]!, variants);
}

export async function createExperiment(input: CreateExperimentInput): Promise<Experiment> {
  return withClient(async (client) => {
    await client.query('BEGIN');
    try {
      const expRes = await client.query<Record<string, unknown>>(
        `INSERT INTO experiments (name, description) VALUES ($1, $2) RETURNING *`,
        [input.name, input.description],
      );
      const exp = expRes.rows[0]!;
      const variantRows: Record<string, unknown>[] = [];

      for (let i = 0; i < input.variants.length; i++) {
        const v = input.variants[i]!;
        const pct = input.trafficSplit[i]!;
        const vRes = await client.query<Record<string, unknown>>(
          `INSERT INTO variants (experiment_id, name, description, traffic_pct) VALUES ($1, $2, $3, $4) RETURNING *`,
          [exp.id, v.name, v.description ?? '', pct],
        );
        variantRows.push(vRes.rows[0]!);
      }

      await client.query('COMMIT');
      return rowToExperiment(exp, variantRows);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  });
}

export async function updateExperiment(id: string, input: UpdateExperimentInput): Promise<Experiment | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (input.name !== undefined) { fields.push(`name = $${idx++}`); values.push(input.name); }
  if (input.description !== undefined) { fields.push(`description = $${idx++}`); values.push(input.description); }
  if (input.status !== undefined) { fields.push(`status = $${idx++}`); values.push(input.status); }
  fields.push(`updated_at = NOW()`);
  values.push(id);

  await query(
    `UPDATE experiments SET ${fields.join(', ')} WHERE id = $${idx}`,
    values,
  );
  return getExperiment(id);
}

// ─── Feature Toggle Service ───────────────────────────────────────────────────

function rowToToggle(row: Record<string, unknown>): FeatureToggle {
  return {
    id: row.id as string,
    key: row.key as string,
    enabled: row.enabled as boolean,
    description: row.description as string,
    updatedAt: row.updated_at as string,
  };
}

export async function listToggles(): Promise<FeatureToggle[]> {
  const rows = await query<Record<string, unknown>>(`SELECT * FROM feature_toggles ORDER BY key ASC`);
  return rows.map(rowToToggle);
}

export async function updateToggle(id: string, enabled: boolean): Promise<FeatureToggle | null> {
  const rows = await query<Record<string, unknown>>(
    `UPDATE feature_toggles SET enabled = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [enabled, id],
  );
  return rows.length > 0 ? rowToToggle(rows[0]!) : null;
}
