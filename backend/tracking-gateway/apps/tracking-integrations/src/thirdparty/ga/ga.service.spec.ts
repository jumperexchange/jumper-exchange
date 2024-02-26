import { Test, TestingModule } from '@nestjs/testing';
import { GaTrackingServiceImpl } from './ga.service';

describe('GaService', () => {
  let service: GaTrackingServiceImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GaTrackingServiceImpl],
    }).compile();

    service = module.get<GaTrackingServiceImpl>(GaTrackingServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
