import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  APPLICATION_NAME: z.string().min(1),
  MONGODB_URI: z.url(),

  SMTP_USER: z.email(),
  SMTP_PASS: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_SERVICE: z.string().min(1),

  ENCRYPTION_SECRET: z.string().min(1),
  ENCRYPTION_IV_LENGTH: z.coerce.number().int().positive(),
  ENCRYPTION_ALGORITHM: z.string().min(1),

  REDIS_URL: z.url(),

  USER_ACCESS_SECRET: z.string().min(1),
  USER_REFRESH_SECRET: z.string().min(1),
  ADMIN_ACCESS_SECRET: z.string().min(1),
  ADMIN_REFRESH_SECRET: z.string().min(1),
  COMPANY_ACCESS_SECRET: z.string().min(1),
  COMPANY_REFRESH_SECRET: z.string().min(1),

  CLIENT_URL: z.url(),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CALLBACK_URL: z.url(),

  AWS_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_EXPIRATION: z.coerce.number().int().positive(),
  AWS_BUCKET_NAME: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

