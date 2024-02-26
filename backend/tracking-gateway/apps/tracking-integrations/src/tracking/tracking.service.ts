import { Inject, Injectable, Logger } from '@nestjs/common';
import { TrackingIntegrationService } from '../domain/tracking/TrackingIntegrationService';
import { TrackingEventDto } from '@jumper-commons/commons/domain/tracking/trackingEventDto';

@Injectable()
export class TrackingService {
  constructor(
    @Inject('GaTrackingService')
    private gaTrackingService: TrackingIntegrationService,
  ) {}

  private readonly logger = new Logger(TrackingService.name);

  async propagateTrackingOnThirdParties(event: TrackingEventDto) {
    await this.gaTrackingService.trackEvent(event);
  }

  async saveTrackingEvent(event: TrackingEventDto) {
    this.logger.log(event);
    // we could save event if required
  }
}
