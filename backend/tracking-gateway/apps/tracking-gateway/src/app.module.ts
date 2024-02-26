import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { EventModule } from './event/event.module';
import { TrackingConfigModule } from './config/service';

@Module({
  imports: [TrackingConfigModule, HealthModule, EventModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
