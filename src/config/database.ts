import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

mongoose.set('strictQuery', true);

export async function connectDatabase(): Promise<void> {
  logger.info('Attempting MongoDB connection...');
  console.log('Attempting MongoDB connection...');

  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected');
    console.log('MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error', {
      error: (err as Error).message,
    });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  await mongoose.connect(env.mongodbUri, {
    serverSelectionTimeoutMS: 10000,
  });

  logger.info('MongoDB connection established successfully');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
