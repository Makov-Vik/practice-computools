import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from 'src/user/user.module';
import { Request } from './request.model';
import { RequestService } from './request.service';

@Module({
  imports: [forwardRef(() =>UserModule), SequelizeModule.forFeature([Request])],
  providers: [RequestService],
  exports: [RequestService]
})
export class RequestModule {}
