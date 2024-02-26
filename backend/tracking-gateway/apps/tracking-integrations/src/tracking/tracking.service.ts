import { Inject, Injectable, Logger } from '@nestjs/common';
import { TrackingIntegrationService } from '../domain/tracking/TrackingIntegrationService';
import { EventDto } from '@jumper-commons/commons/domain/event.dto';

@Injectable()
export class TrackingService {
  constructor(
    @Inject('GaTrackingService')
    private gaTrackingService: TrackingIntegrationService,
  ) {}

  private readonly logger = new Logger(TrackingService.name);

  async trackEvent(event: EventDto) {
    await this.gaTrackingService.trackEvent(event);
  }
}
