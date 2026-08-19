import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { isDatabaseConnected } from './config/database';
import { notFoundHandler } from './middleware/notFound.middleware';
import { errorHandler } from './middleware/error.middleware';
import { apiRouter } from './routes';

const app: Application = express();

// --- Security & core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: ['https://utsavamlive.in', 'http://localhost:5100', 'http://10.61.149.38:5100'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// --- Health check ---
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Utsavam API is healthy',
    data: {
      database: isDatabaseConnected() ? 'connected' : 'disconnected',
      uptimeSeconds: Math.floor(process.uptime()),
    },
  });
});

// --- Swagger ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Versioned API routes ---
app.use(env.apiPrefix, apiRouter);

// --- 404 + centralized error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
