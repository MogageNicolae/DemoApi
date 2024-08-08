import { Injectable, Logger } from '@nestjs/common';
import { NotifierBlockEvent } from './entities/notifier.block.event';
import { NotifierEvent } from './entities';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class EventsNotifierConsumerService {
  private readonly logger: Logger = new Logger(
    EventsNotifierConsumerService.name,
  );

  constructor() {}

  @RabbitSubscribe({
    queue: 'events-622ad86c',
    createQueueIfNotExists: false,
  })
  async consumeEvents(blockEvent: NotifierBlockEvent) {
    try {
      this.logger.log(
        `Received ${blockEvent.events.length} events from block ${blockEvent.hash}`,
      );

      for (const event of blockEvent.events) {
        await this.handleEvent(event);
      }
    } catch (error) {
      this.logger.error(
        `An unhandled error occurred when consuming events from block ${blockEvent.hash}`,
        blockEvent.events,
      );
      this.logger.error(error);

      throw error;
    }
  }

  private async handleEvent(event: NotifierEvent): Promise<void> {
    this.logger.log(event);
  }
}
