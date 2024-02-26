import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { Events } from '@jumper-commons/commons/domain/events';

import { CLIENT_PROXY } from '../constants';
import { TrackingEventDto } from '@jumper-commons/commons/domain/tracking/trackingEventDto';

@Injectable()
export class EventService implements OnApplicationBootstrap {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @Inject(CLIENT_PROXY) private readonly transportClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.transportClient.connect();
    } catch (err) {
      this.logger.error(`Unable to connect to event bus: ${err.message}`);

      throw err;
    }

    this.logger.log('Connected to event-bus');
  }

  createEvent(createEventDto: TrackingEventDto) {
    this.transportClient // TODO: check if we should await and check emit
      .emit(Events.CreateEvent, createEventDto);
  }
}
