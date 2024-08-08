import { Module } from '@nestjs/common';
import {
  ApiMetricsController,
  CommonConfigModule,
  //   DynamicModuleUtils,
  HealthCheckController,
  NetworkConfigModule,
} from '@libs/common';
import { ApiMetricsModule } from '@libs/common';
import { LoggingModule } from '@multiversx/sdk-nestjs-common';
import { AppConfigModule } from './config/app-config.module';
// import { ScheduleModule } from '@nestjs/schedule';
import { EventsNotifierConsumerService } from './events.notifier/events.notifier.consumer.service';
// import { ApiModule } from '@multiversx/sdk-nestjs-http';

@Module({
  imports: [
    LoggingModule,
    NetworkConfigModule,
    ApiMetricsModule,
    AppConfigModule,
    CommonConfigModule,
    // ScheduleModule.forRoot(),
    // DynamicModuleUtils.getCachingModule(),
  ],
  providers: [EventsNotifierConsumerService],
  controllers: [ApiMetricsController, HealthCheckController],
})
export class AppModule {}
