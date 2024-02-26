import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { Events } from '@jumper-commons/commons/domain/events';
import { TrackingEventDto } from '@jumper-commons/commons/domain/tracking/trackingEventDto';
import { CLIENT_PROXY } from '../constants';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';

describe('EventService', () => {
  let service: EventService;
  let transportClientMock: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: CLIENT_PROXY,
          useValue: {
            connect: jest.fn(),
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    transportClientMock = module.get<ClientProxy>(CLIENT_PROXY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to event bus on application bootstrap', async () => {
    await service.onApplicationBootstrap();
    expect(transportClientMock.connect).toHaveBeenCalled();
  });

  it('should emit event with correct data when createEvent is called', () => {
    const createEventDto: TrackingEventDto = {
      action: 'action_1',
      category: 'category_2',
      identityId: 'identityId_3',
      label: 'label_4',
      sessionId: 'sessionId_5',
    };

    service.createEvent(createEventDto);

    expect(transportClientMock.emit).toHaveBeenCalledWith(
      Events.CreateEvent,
      createEventDto,
    );
  });
});
