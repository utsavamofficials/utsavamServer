import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

const swaggerDefinition: swaggerJSDoc.OAS3Definition = {
  openapi: '3.0.0',
  info: {
    title: 'Utsavam Portal API',
    version: '1.0.0',
    description:
      'REST API for the Utsavam Portal - manages Seasons, Events, Event Organizers, ' +
      'Collection Executives, Donors, Donations, Expenses and Receipt Templates.',
  },
  servers: [
    {
      url: `http://localhost:${env.port}${env.apiPrefix}`,
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation successful' },
          data: { type: 'object' },
        },
      },
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
          totalRecords: { type: 'integer', example: 100 },
          totalPages: { type: 'integer', example: 5 },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  // Route/controller files carry the JSDoc @openapi annotations that get merged in here.
  apis: [
    './src/routes/**/*.ts',
    './src/schema/**/*.ts',
    './src/models/**/*.ts',
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
