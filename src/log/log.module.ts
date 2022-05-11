import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSchema } from './log.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [LogService],
  controllers: [LogController],
  imports: [MongooseModule.forFeature([{ name: "Log", schema: LogSchema }]), AuthModule],
  exports: [LogService],
})
export class LogModule {}
