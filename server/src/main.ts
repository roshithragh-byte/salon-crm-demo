import "dotenv/config";
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

  // Configure CORS - restrict to localhost:3000 in development
  const allowedOrigin = process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGIN
    : 'http://localhost:3000';

  app.enableCors({
    origin: allowedOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.API_PORT || 3001, '0.0.0.0');
  logger.info(`API server running on port ${process.env.API_PORT || 3001}`);
}
bootstrap();