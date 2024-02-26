import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

import { TrackingIntegrationService } from '../../domain/tracking/TrackingIntegrationService';
import { EventDto } from '@jumper-commons/commons/domain/event.dto';
import { TrackingIntegrationsConfigService } from '../../config/service';
import { AxiosError } from 'axios';

@Injectable()
export class GaTrackingServiceImpl implements TrackingIntegrationService {
  private readonly logger = new Logger(GaTrackingServiceImpl.name);
  private client_id: string;
  private measurement_id: string;
  private api_secret: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: TrackingIntegrationsConfigService,
  ) {
    this.client_id = this.configService.get(
      'TRACKING_GOOGLE_ANALYTICS_CLIENT_ID',
    );
    this.measurement_id = this.configService.get(
      'TRACKING_GOOGLE_ANALYTICS_ID',
    );
    this.api_secret = this.configService.get(
      'TRACKING_GOOGLE_ANALYTICS_SECRET',
    );
  }

  async trackEvent(event: EventDto): Promise<void> {
    this.logger.debug('new event received', event);

    const { action: name, session_id, ...params } = event;

    const request = this.httpService
      .post(
        `https://www.google-analytics.com/mp/collect`,
        {
          client_id: this.client_id,
          events: [
            {
              name: name,
              params: {
                ...params.data,
                category: params.category,
                label: params.label,
                session_id: session_id,
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
          throw error;
        }),
      );

    await firstValueFrom(request);
  }
}
