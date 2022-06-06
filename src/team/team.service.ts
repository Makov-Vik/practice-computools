import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as Response from '../response.messages';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.model';

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team) private teamRepository: typeof Team) {}

  async createTeam(dto: CreateTeamDto, req: any) {
    const candidate = await this.getTeamByName(dto.name)
    if(candidate) {
      throw new HttpException(Response.SAME_TEAM, HttpStatus.BAD_REQUEST);
    }
    return await this.teamRepository.create({ ...dto, headManager: req.user.id});
  }

  async getTeamByName(name: string) {

    // delete field 'password' in column users ............................................
    return await this.teamRepository.findOne({ where: { name }, include: {all: true} });
  }

  async getTeams() {
    return await this.teamRepository.findAll();
  }
}
