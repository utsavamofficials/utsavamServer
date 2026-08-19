import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  apiPrefix: string;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;
  corsOrigin: string;
  bcryptSaltRounds: number;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  logLevel: string;
  superadmin: {
    fullName: string;
    username: string;
    email: string;
    contactNumber: string;
    password: string;
  };
}

const REQUIRED_VARS = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'] as const;

function assertRequiredEnvVars(): void {
  // Test environment supplies its own in-memory Mongo URI at runtime (see tests/setup),
  // so we don't hard-fail on MONGODB_URI when running under Jest.
  const isTestEnv = process.env.NODE_ENV === 'test';
  const missing = REQUIRED_VARS.filter((key) => {
    if (isTestEnv && key === 'MONGODB_URI') return false;
    return !process.env[key];
  });

  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

assertRequiredEnvVars();

export const env: EnvConfig = {
  nodeEnv: (process.env.NODE_ENV as EnvConfig['nodeEnv']) || 'development',
  port: Number(process.env.PORT) || 5000,
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,
  logLevel: process.env.LOG_LEVEL || 'info',
  superadmin: {
    fullName: process.env.SUPERADMIN_FULL_NAME || 'Super Admin',
    username: process.env.SUPERADMIN_USERNAME || '',
    email: process.env.SUPERADMIN_EMAIL || '',
    contactNumber: process.env.SUPERADMIN_CONTACT_NUMBER || '',
    password: process.env.SUPERADMIN_PASSWORD || '',
  },
};

export const isProduction = env.nodeEnv === 'production';
export const isTest = env.nodeEnv === 'test';