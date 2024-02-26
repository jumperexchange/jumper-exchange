import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { ClientProxyProvider } from '../common/clientProxyProvider';

@Module({
  controllers: [EventController],
  providers: [ClientProxyProvider, EventService],
})
export class EventModule {}
