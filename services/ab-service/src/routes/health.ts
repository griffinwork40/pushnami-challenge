import type { FastifyInstance } from 'fastify';
import { healthCheck } from '../db/client.js';
import { SERVICES, VERSION } from '@pushnami/shared/constants';
import type { HealthResponse } from '@pushnami/shared/types';

// ─── Health Route ─────────────────────────────────────────────────────────────

export async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/health', async (_request, reply) => {
    const dbOk = await healthCheck();

    const body: HealthResponse = {
      status: dbOk ? 'healthy' : 'degraded',
      service: SERVICES.AB_SERVICE.name,
      version: VERSION,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };

    return reply
      .status(dbOk ? 200 : 503)
      .send(body);
  });
}
