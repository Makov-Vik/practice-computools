import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { Team } from './team.model';
import { User } from '../user/user.model';
import { UserTeam } from './user-team.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [TeamService],
  controllers: [TeamController],
  imports: [forwardRef(() => AuthModule), SequelizeModule.forFeature([Team, User, UserTeam])],
  exports: [TeamService]
})
export class TeamModule {}
