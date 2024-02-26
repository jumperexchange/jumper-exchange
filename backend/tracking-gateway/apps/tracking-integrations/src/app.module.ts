import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { TrackingModule } from './tracking/tracking.module';
import { TrackingConfigModule } from './config/service';

@Module({
  imports: [TrackingConfigModule, TrackingModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
