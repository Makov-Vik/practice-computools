import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.model';

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team) private teamRepository: typeof Team) {}

  async createTeam(dto: CreateTeamDto) {
    const team = await this.teamRepository.create(dto);
    return team;
  }

  async getTeamByName(name: string) {
    const team = await this.teamRepository.findOne({ where: { name } });
    return team;
  }
}
