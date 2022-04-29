import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { Team } from './team.model';
import { User } from '../user/user.model';
import { UserTeam } from './user-team.model';

@Module({
  providers: [TeamService],
  controllers: [TeamController],
  imports: [SequelizeModule.forFeature([Team, User, UserTeam])],
})
export class TeamModule {}
