import { Module } from '@nestjs/common';
import { EventGateway } from './events.gateway';

@Module({
  providers: [EventGateway],
  exports: [EventGateway],
})
export class EventModule {}
