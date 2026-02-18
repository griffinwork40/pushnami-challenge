import Fastify, { type FastifyError } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import pino from 'pino';
import { config } from './config';
import healthRoute from './routes/health';
import eventsRoute from './routes/events';
import statsRoute from './routes/stats';

export async function buildApp() {
  const logger = pino({ level: config.LOG_LEVEL, name: 'metrics-service' });

  const app = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      serializers: {
        req: (req) => ({ method: req.method, url: req.url }),
        res: (res) => ({ statusCode: res.statusCode }),
      },
    },
  });

  // ─── Security ───────────────────────────────────────────────────────────────
  await app.register(helmet, {
    contentSecurityPolicy: false, // API service — no HTML
  });

  await app.register(cors, {
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST', 'OPTIONS'],
  });

  // ─── Rate Limiting (global default, overridden per-route) ──────────────────
  await app.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: (_request, context) => ({
      error: 'Too many requests',
      message: `Rate limit exceeded. Try again after ${context.after}`,
      statusCode: 429,
    }),
  });

  // ─── Routes ─────────────────────────────────────────────────────────────────
  await app.register(healthRoute);
  await app.register(eventsRoute);
  await app.register(statsRoute);

  // ─── Global Error Handler ───────────────────────────────────────────────────
  app.setErrorHandler((error: FastifyError, request, reply) => {
    logger.error(
      { err: error, method: request.method, url: request.url },
      'Unhandled error',
    );

    const statusCode = error.statusCode ?? 500;

    if (statusCode >= 500) {
      return reply.status(statusCode).send({
        error: 'Internal server error',
        message:
          config.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : error.message,
      });
    }

    return reply.status(statusCode).send({
      error: error.name ?? 'Error',
      message: error.message,
    });
  });

  // ─── Not Found Handler ──────────────────────────────────────────────────────
  app.setNotFoundHandler((request, reply) => {
    return reply.status(404).send({
      error: 'Not found',
      message: `Route ${request.method} ${request.url} not found`,
    });
  });

  return app;
}
