import { z } from 'zod';

const ConfigSchema = z.object({
  PORT: z.coerce.number().default(3002),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  CORS_ORIGIN: z.string().default('*'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
});

export type Config = z.infer<typeof ConfigSchema>;

function loadConfig(): Config {
  const result = ConfigSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment configuration:');
    for (const [field, issue] of Object.entries(result.error.flatten().fieldErrors)) {
      console.error(`  ${field}: ${(issue as string[]).join(', ')}`);
    }
    process.exit(1);
  }
  return result.data;
}

export const config = loadConfig();
