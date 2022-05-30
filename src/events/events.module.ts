import { forwardRef, Module } from '@nestjs/common';
import { LogModule } from 'src/log/log.module';
import { AuthModule } from '../auth/auth.module';
import { EventGateway } from './events.gateway';

@Module({
  imports: [ forwardRef(() => AuthModule), LogModule],
  providers: [EventGateway],
  exports: [EventGateway],
})
export class EventModule {}
