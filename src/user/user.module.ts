import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from 'src/role/role.model';
import { Team } from 'src/team/team.model';
import { UserTeam } from 'src/team/user-team.model';
import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [SequelizeModule.forFeature([User, Role, Team, UserTeam])],
})
export class UserModule {}
