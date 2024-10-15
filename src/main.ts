import * as dotenv from 'dotenv';
import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setup } from './setup';

dotenv.config();
function isLogLevel(value: any): value is LogLevel {
  return value in ['log', 'error', 'warn', 'debug', 'verbose'];
}

async function bootstrap() {
  const logLevel = isLogLevel(process.env.LOG_LEVEL)
    ? process.env.LOG_LEVEL
    : 'log';

  const app = await NestFactory.create(AppModule, {
    logger: [logLevel],
  });

  setup(app);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
