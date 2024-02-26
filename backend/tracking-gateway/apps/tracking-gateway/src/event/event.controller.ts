import { Body, Controller, Post } from '@nestjs/common';

import { EventService } from './event.service';
import { PostTrackingEventDto } from './postTrackingEventDto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('track')
  createEvent(@Body() createEventDto: PostTrackingEventDto) {
    return this.eventService.createEvent(createEventDto);
  }
}
