import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { IngestEventSchema } from '@pushnami/shared/schemas';
import { insertEvent, insertEventBatch } from '../services/events';

const BatchEventSchema = z.object({
  events: z.array(IngestEventSchema).min(1).max(500),
});

const events: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/events
   * Ingest a single tracking event.
   */
  fastify.post(
    '/api/events',
    {
      config: { rateLimit: { max: 200, timeWindow: '1 minute' } },
    },
    async (request, reply) => {
      const parseResult = IngestEventSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        });
      }

      const result = await insertEvent(parseResult.data);

      return reply.status(201).send({
        id: result.id,
        createdAt: result.createdAt,
        message: 'Event recorded',
      });
    },
  );

  /**
   * POST /api/events/batch
   * Bulk-ingest multiple tracking events in a single transaction.
   */
  fastify.post(
    '/api/events/batch',
    {
      config: { rateLimit: { max: 50, timeWindow: '1 minute' } },
    },
    async (request, reply) => {
      const parseResult = BatchEventSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        });
      }

      const { count } = await insertEventBatch(parseResult.data.events);

      return reply.status(201).send({
        count,
        message: `${count} event(s) recorded`,
      });
    },
  );
};

export default events;
