import type { FastifyInstance } from 'fastify';
import { ToggleUpdateSchema, UUIDParam } from '@pushnami/shared/schemas';
import { listToggles, updateToggle } from '../services/experiment.js';

// ─── Feature Toggle Routes ────────────────────────────────────────────────────

export async function toggleRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /api/toggles — list all feature toggles
  fastify.get('/api/toggles', async (_request, reply) => {
    try {
      const toggles = await listToggles();
      return reply.send(toggles);
    } catch (err) {
      fastify.log.error({ err }, 'Failed to list toggles');
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // PATCH /api/toggles/:id — update a toggle's enabled state
  fastify.patch<{ Params: { id: string } }>('/api/toggles/:id', async (request, reply) => {
    const paramResult = UUIDParam.safeParse(request.params);
    if (!paramResult.success) {
      return reply.status(400).send({ error: 'Invalid toggle ID' });
    }

    const bodyResult = ToggleUpdateSchema.safeParse(request.body);
    if (!bodyResult.success) {
      return reply.status(400).send({
        error: 'Validation error',
        details: bodyResult.error.flatten().fieldErrors,
      });
    }

    try {
      const toggle = await updateToggle(paramResult.data.id, bodyResult.data.enabled);
      if (!toggle) {
        return reply.status(404).send({ error: 'Feature toggle not found' });
      }
      return reply.send(toggle);
    } catch (err) {
      fastify.log.error({ err }, 'Failed to update toggle');
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
