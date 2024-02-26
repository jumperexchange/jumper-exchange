import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';

import { TrackingEventDto } from '@jumper-commons/commons/domain/tracking/trackingEventDto';
import { AxiosError } from 'axios';

import { TrackingIntegrationService } from '../../domain/tracking/TrackingIntegrationService';
import { TrackingIntegrationsConfigService } from '../../config/service';

@Injectable()
export class GaTrackingServiceImpl implements TrackingIntegrationService {
  private readonly logger = new Logger(GaTrackingServiceImpl.name);
  private measurement_id: string;
  private api_secret: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: TrackingIntegrationsConfigService,
  ) {
    this.measurement_id = this.configService.get(
      'TRACKING_GOOGLE_ANALYTICS_ID',
    );
    this.api_secret = this.configService.get(
      'TRACKING_GOOGLE_ANALYTICS_SECRET',
    );
  }

  async trackEvent(event: TrackingEventDto): Promise<void> {
    this.logger.debug('new event received', event);

    const { action: name, sessionId, identityId, ...params } = event;

    const request = this.httpService
      .post(
        `https://www.google-analytics.com/mp/collect`,
        {
          client_id: identityId,
          events: [
            {
              name: name,
              params: {
                ...params.data,
                category: params.category,
                label: params.label,
                session_id: sessionId,
                //TODO: may need to figure out what to do with it
                engagement_time_msec: '1000',
              },
            },
          ],
        },
        {
          params: {
            measurement_id: this.measurement_id,
            api_secret: this.api_secret,
          },
        },
      )
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(`Error occured during request: ${error.message}`);
          return throwError(() => error);
        }),
      );

    await firstValueFrom(request);
  }
}
