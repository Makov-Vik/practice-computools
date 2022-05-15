import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './role.model';
import { User } from '../user/user.model';
import { LogModule } from 'src/log/log.module';

@Module({
  providers: [RoleService],
  controllers: [RoleController],
  imports: [LogModule, SequelizeModule.forFeature([Role, User])],
  exports: [RoleService],
})
export class RoleModule {}
