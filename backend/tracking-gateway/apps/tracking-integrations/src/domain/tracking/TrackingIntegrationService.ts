import { TrackingEventDto } from '@jumper-commons/commons/domain/tracking/trackingEventDto';

export interface TrackingIntegrationService {
  trackEvent(event: TrackingEventDto): Promise<void>;
}
