import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SAME_TEAM } from '../constants';
import { User } from '../user/user.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './team.model';

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team) private teamRepository: typeof Team) {}

  async createTeam(dto: CreateTeamDto, req: any) {
    const candidate = await this.getTeamByName(dto.name)
    if(candidate) {
      throw new HttpException(SAME_TEAM, HttpStatus.BAD_REQUEST);
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

  // async addToTeam(user: User, team: Team) {
  //   // console.log(userId);
  //   // const user = await this.teamRepository.findOne({ where: {id: userId} });
  //   // if(!user) {
  //   //   throw new HttpException({message: 'user not found'}, HttpStatus.NOT_FOUND); 
  //   // }

  //   // const team2 = await this.getTeamByName(team.name)
  //   // if (!team2) {
  //   //   throw {}
  //   // }
  //   // const usersUpdate = team.users;
  //   // usersUpdate.push(user);


  //   // why doesn't work .save() / $add() ????????????????????????????
  //   try {
  //     await team.$add('users', user);
  //     //const newUser = await this.userRepository.update({'teams': teamsUpdate}, { where: {id: userId} });
      
  //     // log to mongo
  //     // const log = {
  //     // message: `add to team ${team} user ${user.email}`,
  //     // where: 'user.servise.ts (addToTeam())',
  //     // type: LogType[LogType.update]
  //     // }
  //     // await this.logService.create(log); 

  //     //return user;      
  //   } catch(e) {
  //     console.log(e)
  //     // log to mongo
  //     // const log = {
  //     // message: `faild update db. ${e}`,
  //     // where: 'user.servise.ts (addToTeam())',
  //     // type: LogType[LogType.error]
  //     // }
  //     // await this.logService.create(log);
 
  //   }
  // }
}
