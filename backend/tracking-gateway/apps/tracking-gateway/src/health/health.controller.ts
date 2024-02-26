import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    //TODO: check if event-bus is accessible
    return 'ok';
  }
}
