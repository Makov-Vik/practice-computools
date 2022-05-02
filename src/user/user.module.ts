import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RequestModule } from 'src/request/request.module';
import { AuthModule } from '../auth/auth.module';
import { LogModule } from '../log/log.module';
import { Role } from '../role/role.model';
import { RoleModule } from '../role/role.module';
import { Team } from '../team/team.model';
import { UserTeam } from '../team/user-team.model';
import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    SequelizeModule.forFeature([User, Role, Team, UserTeam]),
    RoleModule,
    forwardRef(() => AuthModule),
    LogModule,
    forwardRef(() =>RequestModule)
  ],
  exports: [UserService],
})
export class UserModule {}
