import { Pool } from 'pg';
import pino from 'pino';
import { config } from '../config';

const logger = pino({ name: 'db', level: config.LOG_LEVEL });

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('connect', () => {
  logger.debug('New database connection established');
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected database pool error');
});

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    logger.error({ err }, 'Database health check failed');
    return false;
  }
}

export async function closePool(): Promise<void> {
  await pool.end();
  logger.info('Database pool closed');
}
