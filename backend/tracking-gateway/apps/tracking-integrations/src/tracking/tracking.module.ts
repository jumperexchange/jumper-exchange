import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { GaModule } from '../thirdparty/ga/ga.module';

@Module({
  imports: [GaModule],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
