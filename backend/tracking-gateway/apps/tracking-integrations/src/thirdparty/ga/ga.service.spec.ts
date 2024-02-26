import { Test, TestingModule } from '@nestjs/testing';
import { GaTrackingServiceImpl } from './ga.service';
import { HttpService } from '@nestjs/axios';
import { TrackingIntegrationsConfigService } from '../../config/service';
import { of, throwError } from 'rxjs';
import { TrackingEventDto } from '@jumper-commons/commons/domain/tracking/trackingEventDto';

describe('GaTrackingServiceImpl', () => {
  let service: GaTrackingServiceImpl;
  let httpServiceMock: HttpService;
  let configServiceMock: TrackingIntegrationsConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GaTrackingServiceImpl,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: TrackingIntegrationsConfigService,
          useValue: {
            get: (prop) => prop,
          },
        },
      ],
    }).compile();

    service = module.get<GaTrackingServiceImpl>(GaTrackingServiceImpl);
    httpServiceMock = module.get<HttpService>(HttpService);
    configServiceMock = module.get<TrackingIntegrationsConfigService>(
      TrackingIntegrationsConfigService,
    );

    // Mock configuration values
    jest.spyOn(configServiceMock, 'get').mockImplementation((key: string) => {
      if (key === 'TRACKING_GOOGLE_ANALYTICS_ID') {
        return 'mock_measurement_id';
      } else if (key === 'TRACKING_GOOGLE_ANALYTICS_SECRET') {
        return 'mock_api_secret';
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('trackEvent', () => {
    it('should send tracking event to Google Analytics', async () => {
      const event: TrackingEventDto = {
        action: 'testAction',
        sessionId: 'testSessionId',
        identityId: 'testIdentityId',
        category: 'testCategory',
        label: 'testLabel',
        value: 123,
        data: { customData: 'test' },
      };

      jest.spyOn(httpServiceMock, 'post').mockReturnValue(of(1 as any));

      await service.trackEvent(event);

      expect(httpServiceMock.post).toHaveBeenCalledWith(
        'https://www.google-analytics.com/mp/collect',
        {
          client_id: event.identityId,
          events: [
            {
              name: event.action,
              params: {
                ...event.data,
                category: event.category,
                label: event.label,
                session_id: event.sessionId,
                engagement_time_msec: '1000',
              },
            },
          ],
        },
        {
          params: {
            measurement_id: 'TRACKING_GOOGLE_ANALYTICS_ID',
            api_secret: 'TRACKING_GOOGLE_ANALYTICS_SECRET',
          },
        },
      );
    });

    it('should handle error if request fails', async () => {
      const event: TrackingEventDto = {
        action: 'testAction',
        sessionId: 'testSessionId',
        identityId: 'testIdentityId',
        category: 'testCategory',
        label: 'testLabel',
        value: 123,
        data: { customData: 'test' },
      };

      jest
        .spyOn(httpServiceMock, 'post')
        .mockReturnValue(throwError(() => new Error('Request failed')));
      const loggerErrorSpy = jest.spyOn(service['logger'], 'error');

      await expect(service.trackEvent(event)).rejects.toThrowError(
        'Request failed',
      );
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Error occured during request: Request failed',
      );
    });
  });
});
