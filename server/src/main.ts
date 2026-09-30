import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url} - IP: ${req.ip}`);
    res.locals.requestId = req.headers['x-request-id'] || require('crypto').randomUUID();
    next();
  });
  app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`, err);
    next(err);
  });

  // Configure CORS
  const allowedOrigins = [
    'http://localhost:3000',
    'https://salon-crm-demo-theta.vercel.app',
    process.env.ALLOWED_ORIGIN
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  const port = process.env.API_PORT || (process.env.NODE_ENV === 'production' ? process.env.PORT : (process.env.PORT !== '3000' ? process.env.PORT : null)) || 3001;
  await app.listen(port, '0.0.0.0');
  logger.info(`API server running on port ${port}`);
}
bootstrap();