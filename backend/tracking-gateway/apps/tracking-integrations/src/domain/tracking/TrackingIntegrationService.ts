import { EventDto } from '@jumper-commons/commons/domain/event.dto';

export interface TrackingIntegrationService {
  trackEvent(event: EventDto): Promise<void>;
}
