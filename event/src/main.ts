import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();
  const port = parseInt(configService.getOrThrow('EVENT_PORT'));
  await app.listen(port);
}
bootstrap();
