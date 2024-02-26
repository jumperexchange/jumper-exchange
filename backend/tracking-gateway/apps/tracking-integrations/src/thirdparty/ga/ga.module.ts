import { Module } from '@nestjs/common';
import { GaTrackingServiceImpl } from './ga.service';
import { HttpModule } from '@nestjs/axios';

const GaProvider = {
  provide: 'GaTrackingService',
  useClass: GaTrackingServiceImpl,
};

@Module({
  imports: [HttpModule],
  providers: [GaProvider],
  exports: ['GaTrackingService'],
})
export class GaModule {}
