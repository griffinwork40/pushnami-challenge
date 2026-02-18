import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { StatsQuerySchema } from '@pushnami/shared/schemas';
import { getExperimentStats } from '../services/stats';

// Stats endpoint requires experimentId — override the shared schema
const StatsEndpointSchema = StatsQuerySchema.extend({
  experimentId: z.string().uuid({ message: 'experimentId must be a valid UUID' }),
});

const stats: FastifyPluginAsync = async (fastify) => {
  /**
   * GET /api/stats
   * Returns aggregated experiment statistics with statistical significance.
   */
  fastify.get(
    '/api/stats',
    {
      config: { rateLimit: { max: 50, timeWindow: '1 minute' } },
    },
    async (request, reply) => {
      const parseResult = StatsEndpointSchema.safeParse(request.query);
      if (!parseResult.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        });
      }

      const { experimentId, startDate, endDate } = parseResult.data;

      const experimentStats = await getExperimentStats(
        experimentId,
        startDate,
        endDate,
      );

      if (!experimentStats) {
        return reply.status(404).send({
          error: 'Experiment not found',
          experimentId,
        });
      }

      return reply.status(200).send(experimentStats);
    },
  );
};

export default stats;
