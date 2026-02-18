import { buildServer } from './server.js';
import { config } from './config.js';
import { closePool } from './db/client.js';

// ─── Entry Point ──────────────────────────────────────────────────────────────

async function main() {
  const server = await buildServer();

  // Graceful shutdown handler
  const shutdown = async (signal: string) => {
    server.log.info({ signal }, 'Received shutdown signal, closing gracefully...');
    try {
      await server.close();
      await closePool();
      server.log.info('Server and DB pool closed. Bye!');
      process.exit(0);
    } catch (err) {
      server.log.error({ err }, 'Error during shutdown');
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  try {
    await server.listen({ port: config.port, host: config.host });
    server.log.info(
      { port: config.port, host: config.host },
      'AB Service started',
    );
  } catch (err) {
    server.log.error({ err }, 'Failed to start server');
    await closePool();
    process.exit(1);
  }
}

main();
