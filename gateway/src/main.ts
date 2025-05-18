import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const authServiceUrl = config.getOrThrow<string>('services.auth');
  const eventServiceUrl = config.getOrThrow<string>('services.event');

  app.setGlobalPrefix('api');
  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: authServiceUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/api/auth': '',
      },
      on: {
        error: (err, req, res) => {
          console.error('auth proxy error', err);
          const response = res as unknown as Response;
          if (!response.headersSent) {
            response.status(500).json({ message: 'Internal server error' });
          }
        },
      },
    }),
  );
  app.use(
    '/api/event',
    createProxyMiddleware({
      target: eventServiceUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/api/event': '',
      },
      on: {
        error: (err, req, res) => {
          console.error('event proxy error', err);
          const response = res as unknown as Response;
          if (!response.headersSent) {
            response.status(500).json({ message: 'Internal server error' });
          }
        },
      },
    }),
  );
  await app.listen(process.env.GATEWAY_PORT ?? 3000);
}
bootstrap();
