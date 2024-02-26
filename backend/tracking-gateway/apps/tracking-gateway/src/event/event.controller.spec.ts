import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { PostEventDto } from './postEventDto';

describe('EventController', () => {
  let controller: EventController;
  let eventService: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: {
            createEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    eventService = module.get<EventService>(EventService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEvent', () => {
    it('should call eventService.createEvent with the correct parameters', () => {
      const eventDto: PostEventDto = {
        action: 'test',
        category: 'cat_test',
        label: 'new_label',
        /* provide necessary data */
      };
      // const expectedResult = {
      //   action: 'test',
      //   category: 'cat_test',
      //   label: 'new_label',
      //   /* provide expected result */
      // };

      // expect(controller.createEvent(eventDto)).resolves.toEqual(expectedResult);
      expect(eventService.createEvent).toHaveBeenCalledWith(eventDto);
    });
  });
});
