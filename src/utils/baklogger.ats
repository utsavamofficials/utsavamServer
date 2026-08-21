import path from 'path';
import winston from 'winston';
import { env, isProduction } from '../config/env';

const LOGS_DIR = path.join(__dirname, '..', 'logs');

// Fields that must never reach a log line, even inside nested metadata.
const SENSITIVE_KEYS = new Set([
  'password',
  'passwordHash',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'jwt',
  'jwtSecret',
  'secret',
]);

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = SENSITIVE_KEYS.has(key.toLowerCase()) ? '[REDACTED]' : redact(val);
    }
    return out;
  }
  return value;
}

const redactFormat = winston.format((info) => {
  const { level, message, timestamp, ...meta } = info;
  return { level, message, timestamp, ...(redact(meta) as object) };
});

export const logger = winston.createLogger({
  level: env.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    redactFormat(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: path.join(LOGS_DIR, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(LOGS_DIR, 'combined.log') }),
  ],
});

if (!isProduction) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
}
