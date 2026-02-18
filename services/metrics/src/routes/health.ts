import type { FastifyPluginAsync } from 'fastify';
import { checkDatabaseHealth } from '../db/client';
import { SERVICES, VERSION } from '@pushnami/shared/constants';

const health: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/api/health',
    {
      config: { rateLimit: { max: 60, timeWindow: '1 minute' } },
    },
    async (_request, reply) => {
      const dbHealthy = await checkDatabaseHealth();
      const status = dbHealthy ? 'healthy' : 'degraded';

      return reply.status(dbHealthy ? 200 : 503).send({
        status,
        service: SERVICES.METRICS.name,
        version: VERSION,
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      });
    },
  );
};

export default health;
