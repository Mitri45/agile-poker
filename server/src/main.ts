// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for WebSocket allow *
  app.enableCors({ origin: '*' });

  // Use custom IoAdapter for WebSocket
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3001); // Use a different port if needed
}
bootstrap();
