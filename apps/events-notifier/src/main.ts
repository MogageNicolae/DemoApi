import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Determine which .env file to load based on NODE_ENV
const envPath =
  process.env.NODE_ENV === 'infra'
    ? '.env'
    : `.env.${process.env.NODE_ENV ?? 'mainnet'}`;
dotenv.config({
  path: resolve(process.cwd(), envPath),
});

import 'module-alias/register';
import { Logger } from '@nestjs/common';
import { LoggerInitializer } from '@multiversx/sdk-nestjs-common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { EventsNotifierModule } from './events.notifier/events.notifier.module';

async function bootstrap() {
  const transactionProcessorApp = await NestFactory.create(AppModule);
  const eventsNotifierApp = await NestFactory.create(EventsNotifierModule);
  const appConfigService =
    transactionProcessorApp.get<AppConfigService>(AppConfigService);
  await eventsNotifierApp.listen(appConfigService.config.port);

  const logger = new Logger('Bootstrapper');

  LoggerInitializer.initialize(logger);

  logger.log('Events notifier active started');
}

bootstrap();
