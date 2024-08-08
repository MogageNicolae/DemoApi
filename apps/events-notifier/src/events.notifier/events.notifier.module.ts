import {
  RabbitModule,
  RabbitModuleOptions,
} from '@multiversx/sdk-nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { EventsNotifierConsumerService } from './events.notifier.consumer.service';

@Module({
  imports: [
    RabbitModule.forRootAsync({
      useFactory: () =>
        new RabbitModuleOptions(
          'amqp://user-622ad86c:5d595182393339e3919b4a3b1f96dbe31fae1bb17f2629ccbcccbed89d3965fa@devnet-rabbitmq.beaconx.app:5672/',
          [],
        ),
    }),
  ],
  providers: [EventsNotifierConsumerService],
})
export class EventsNotifierModule {}
