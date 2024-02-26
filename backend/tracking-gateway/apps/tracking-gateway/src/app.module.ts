import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { EventModule } from './event/event.module';
import { TrackingConfigModule } from './config/service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TrackingConfigModule, HealthModule, EventModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
