import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.EVENT_PORT ?? '3002', 10);
  await app.listen(port);
}
bootstrap();
