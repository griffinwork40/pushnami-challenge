import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config } from './config.js';
import { healthRoutes } from './routes/health.js';
import { assignmentRoutes } from './routes/assignments.js';
import { experimentRoutes } from './routes/experiments.js';
import { toggleRoutes } from './routes/toggles.js';

// ─── Fastify App Factory ──────────────────────────────────────────────────────

export async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: config.nodeEnv === 'test' ? 'silent' : 'info',
      transport: config.nodeEnv === 'development'
        ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss' } }
        : undefined,
    },
  });

  // ── Security Headers ──────────────────────────────────────────────────────
  await fastify.register(helmet, {
    contentSecurityPolicy: false, // API service — no CSP needed
  });

  // ── CORS (all origins for dev convenience) ────────────────────────────────
  await fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // ── Rate Limiting: 100 req/min per IP ─────────────────────────────────────
  await fastify.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow,
    errorResponseBuilder: (_request, context) => ({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${context.after}.`,
      statusCode: 429,
    }),
  });

  // ── Routes ────────────────────────────────────────────────────────────────
  await fastify.register(healthRoutes);
  await fastify.register(assignmentRoutes);
  await fastify.register(experimentRoutes);
  await fastify.register(toggleRoutes);

  // ── Global Error Handler ──────────────────────────────────────────────────
  fastify.setErrorHandler((error: Error & { statusCode?: number }, request, reply) => {
    fastify.log.error({ err: error, url: request.url }, 'Unhandled error');
    const statusCode = error.statusCode ?? 500;
    return reply.status(statusCode).send({
      error: statusCode === 500 ? 'Internal server error' : error.message,
    });
  });

  // ── 404 Handler ───────────────────────────────────────────────────────────
  fastify.setNotFoundHandler((request, reply) => {
    return reply.status(404).send({
      error: 'Not Found',
      message: `Route ${request.method} ${request.url} not found`,
    });
  });

  return fastify;
}
