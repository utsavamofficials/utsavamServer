import { app } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { seedSuperAdmin } from './utils/seedSuperAdmin';
import { logger } from './utils/logger';

let server: ReturnType<typeof app.listen>;

async function bootstrap(): Promise<void> {
  console.log("upto here")
  await connectDatabase();
  await seedSuperAdmin();  

  server = app.listen(env.port, () => {
    logger.info(`Utsavam API listening on port ${env.port} [${env.nodeEnv}]`);
    logger.info(`Swagger docs available at http://localhost:${env.port}/api-docs`);
    
    console.log(`Utsavam API listening on port ${env.port} [${env.nodeEnv}]`);
    console.log(`Swagger docs available at http://localhost:${env.port}/api-docs`);
  });
}

async function shutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server?.close(async () => {
    await disconnectDatabase();
    logger.info('Shutdown complete.');
    process.exit(0);
  });

  // Force-exit if graceful shutdown hangs.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

bootstrap().catch((err) => {
  logger.error('Failed to start server', { error: (err as Error).message });
  process.exit(1);
});
