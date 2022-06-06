import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../user/user.module';
import { Request } from './request.model';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TeamModule } from '../team/team.module';
import { AuthModule } from '../auth/auth.module';
import { LogModule } from '../log/log.module';
import { EventModule } from 'src/events/events.module';
import { RequestType } from './requestType.model';
import { RequestStatus } from './requestStatus.model';

@Module({
  imports: [
    forwardRef(() => LogModule),
    forwardRef(() =>UserModule), 
    TeamModule, 
    EventModule,
    forwardRef(() =>AuthModule),
    SequelizeModule.forFeature([Request, RequestType, RequestStatus])
  ],
  providers: [RequestService],
  exports: [RequestService],
  controllers: [RequestController]
})
export class RequestModule {}
