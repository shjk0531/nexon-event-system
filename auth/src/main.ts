import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();
  app.use(cookieParser());
  const port = parseInt(configService.getOrThrow('AUTH_PORT'));
  await app.listen(port);
}
bootstrap();
