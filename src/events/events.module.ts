import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EventGateway } from './events.gateway';

@Module({
  imports: [ forwardRef(() => AuthModule)],
  providers: [EventGateway],
  exports: [EventGateway],
})
export class EventModule {}
