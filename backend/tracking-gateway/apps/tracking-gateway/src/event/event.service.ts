import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { Events } from '@jumper-commons/commons/domain/events';
import { EventDto } from '@jumper-commons/commons/domain/event.dto';

import { CLIENT_PROXY } from '../constants';

@Injectable()
export class EventService implements OnModuleInit {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @Inject(CLIENT_PROXY) private readonly transportClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.transportClient.connect();

    this.logger.log('Connected to event-bus');
  }

  createEvent(createEventDto: EventDto) {
    this.transportClient // TODO: check if we should await and check emit
      .emit(Events.CREATE_EVENT, createEventDto);
  }
}
