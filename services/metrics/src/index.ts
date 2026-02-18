import { buildApp } from './server';
import { config } from './config';
import { closePool } from './db/client';

async function main() {
  const app = await buildApp();

  // ─── Graceful Shutdown ─────────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    app.log.info(`Received ${signal}, shutting down gracefully...`);
    try {
      await app.close();
      await closePool();
      app.log.info('Server and DB pool closed. Goodbye 👋');
      process.exit(0);
    } catch (err) {
      app.log.error({ err }, 'Error during shutdown');
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // ─── Start ──────────────────────────────────────────────────────────────────
  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    app.log.info(
      { port: config.PORT, host: config.HOST, env: config.NODE_ENV },
      '🚀 Metrics service started',
    );
  } catch (err) {
    app.log.error({ err }, 'Failed to start server');
    await closePool();
    process.exit(1);
  }
}

main();
