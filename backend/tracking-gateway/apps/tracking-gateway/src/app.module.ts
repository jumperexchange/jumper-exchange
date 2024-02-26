import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { EventModule } from './event/event.module';
import { TrackingConfigModule } from './config/service';
import { AuthModule } from './auth/auth.module';
import { ClientProxyProvider } from './common/clientProxyProvider';
import { ClientProxyModule } from './common/client.module';

@Module({
  imports: [
    ClientProxyModule,
    TrackingConfigModule,
    HealthModule,
    EventModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
