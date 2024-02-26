import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  providers: [],
  controllers: [HealthController],
})
export class HealthModule {}
