import type { FastifyInstance } from 'fastify';
import { CreateExperimentSchema, UpdateExperimentSchema, UUIDParam } from '@pushnami/shared/schemas';
import {
  listExperiments,
  getExperiment,
  createExperiment,
  updateExperiment,
} from '../services/experiment.js';

// ─── Experiment Routes ────────────────────────────────────────────────────────

export async function experimentRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /api/experiments — list all experiments
  fastify.get('/api/experiments', async (_request, reply) => {
    try {
      const experiments = await listExperiments();
      return reply.send(experiments);
    } catch (err) {
      fastify.log.error({ err }, 'Failed to list experiments');
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // POST /api/experiments — create experiment with variants
  fastify.post('/api/experiments', async (request, reply) => {
    const parseResult = CreateExperimentSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    try {
      const experiment = await createExperiment(parseResult.data);
      return reply.status(201).send(experiment);
    } catch (err) {
      fastify.log.error({ err }, 'Failed to create experiment');
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // GET /api/experiments/:id — get single experiment
  fastify.get<{ Params: { id: string } }>('/api/experiments/:id', async (request, reply) => {
    const paramResult = UUIDParam.safeParse(request.params);
    if (!paramResult.success) {
      return reply.status(400).send({ error: 'Invalid experiment ID' });
    }

    try {
      const experiment = await getExperiment(paramResult.data.id);
      if (!experiment) {
        return reply.status(404).send({ error: 'Experiment not found' });
      }
      return reply.send(experiment);
    } catch (err) {
      fastify.log.error({ err }, 'Failed to get experiment');
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // PATCH /api/experiments/:id — update experiment
  fastify.patch<{ Params: { id: string } }>('/api/experiments/:id', async (request, reply) => {
    const paramResult = UUIDParam.safeParse(request.params);
    if (!paramResult.success) {
      return reply.status(400).send({ error: 'Invalid experiment ID' });
    }

    const bodyResult = UpdateExperimentSchema.safeParse(request.body);
    if (!bodyResult.success) {
      return reply.status(400).send({
        error: 'Validation error',
        details: bodyResult.error.flatten().fieldErrors,
      });
    }

    try {
      const experiment = await updateExperiment(paramResult.data.id, bodyResult.data);
      if (!experiment) {
        return reply.status(404).send({ error: 'Experiment not found' });
      }
      return reply.send(experiment);
    } catch (err) {
      fastify.log.error({ err }, 'Failed to update experiment');
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
