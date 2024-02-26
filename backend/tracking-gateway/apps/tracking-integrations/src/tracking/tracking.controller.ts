import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { Events } from '@jumper-commons/commons/domain/events';

import { TrackingService } from './tracking.service';
import { TrackingEventDto } from '@jumper-commons/commons/domain/tracking/trackingEventDto';

@Controller()
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @EventPattern(Events.CREATE_EVENT)
  createEvent(@Payload(ValidationPipe) createEventDto: TrackingEventDto) {
    return this.trackingService.propagateTrackingOnThirdParties(createEventDto);
  }

  @EventPattern(Events.CREATE_EVENT)
  saveEvent(@Payload(ValidationPipe) createEventDto: TrackingEventDto) {
    return this.trackingService.saveTrackingEvent(createEventDto);
  }
}
