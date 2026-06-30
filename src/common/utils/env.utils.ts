import { Env, envSchema } from 'src/common/schemas/env.schema';

export function validateEnv(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error('Invalid environment variables', {
      cause: {
        issues,
      },
    });
  }
  return result.data;
}
