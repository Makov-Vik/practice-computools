import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { Team } from './team.model';
import { User } from '../user/user.model';
import { UserTeam } from './user-team.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [TeamService],
  controllers: [TeamController],
  imports: [AuthModule, SequelizeModule.forFeature([Team, User, UserTeam])],
  exports: [TeamService]
})
export class TeamModule {}
