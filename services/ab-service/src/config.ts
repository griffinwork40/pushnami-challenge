// ─── Environment Configuration ───────────────────────────────────────────────

interface Config {
  port: number;
  host: string;
  nodeEnv: string;
  db: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    maxConnections: number;
  };
  rateLimit: {
    max: number;
    timeWindow: string;
  };
}

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function parseDbConfig(): Config['db'] {
  const url = process.env.DATABASE_URL;
  if (url) {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port || '5432', 10),
      database: parsed.pathname.slice(1),
      user: parsed.username,
      password: parsed.password,
      maxConnections: 10,
    };
  }
  return {
    host: requireEnv('DB_HOST', 'localhost'),
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    database: requireEnv('DB_NAME', 'pushnami'),
    user: requireEnv('DB_USER', 'postgres'),
    password: requireEnv('DB_PASSWORD', 'postgres'),
    maxConnections: 10,
  };
}

export const config: Config = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  host: process.env.HOST ?? '0.0.0.0',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  db: parseDbConfig(),
  rateLimit: {
    max: 100,
    timeWindow: '1 minute',
  },
};
