import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { Events } from '@jumper-commons/commons/domain/events';

import { TrackingService } from './tracking.service';
import { EventDto } from '@jumper-commons/commons/domain/event.dto';

@Controller()
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @EventPattern(Events.CREATE_EVENT)
  createEvent(@Payload(ValidationPipe) createEventDto: EventDto) {
    return this.trackingService.trackEvent(createEventDto);
  }
}
