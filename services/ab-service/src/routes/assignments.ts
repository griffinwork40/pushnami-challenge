import type { FastifyInstance } from 'fastify';
import { AssignVariantSchema } from '@pushnami/shared/schemas';
import { assignVisitor } from '../services/assignment.js';

// ─── Assignment Routes ────────────────────────────────────────────────────────

export async function assignmentRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/api/assignments', async (request, reply) => {
    // Validate request body with Zod
    const parseResult = AssignVariantSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { visitorId, experimentId } = parseResult.data;

    try {
      const result = await assignVisitor(visitorId, experimentId);
      return reply.status(200).send(result);
    } catch (err: unknown) {
      const statusCode = (err as { statusCode?: number }).statusCode;
      if (statusCode === 404) {
        return reply.status(404).send({ error: 'Experiment not found or has no variants' });
      }
      fastify.log.error({ err }, 'Failed to assign visitor');
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
