import { Test, TestingModule } from '@nestjs/testing';
import { GaService } from './ga.service';

describe('GaService', () => {
  let service: GaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GaService],
    }).compile();

    service = module.get<GaService>(GaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
