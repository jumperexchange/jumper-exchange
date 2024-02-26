import { Body, Controller, Post } from '@nestjs/common';

import { EventService } from './event.service';
import { PostEventDto } from './postEventDto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('track')
  createEvent(@Body() createEventDto: PostEventDto) {
    return this.eventService.createEvent({
      ...createEventDto,
      session_id: '1',
    });
  }
}
