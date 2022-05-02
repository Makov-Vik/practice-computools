import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRequsetDto } from './dto/create-request.dto';
import { Request } from './request.model';
import { mailer } from '../nodemailer';
import { UserService } from 'src/user/user.service';
import { RECIPIENT_NOT_FOUND, RESENDING } from 'src/constants';
import { TeamService } from 'src/team/team.service';
import { User } from 'src/user/user.model';

@Injectable()
export class RequestService {
  constructor(@InjectModel(Request) private requestRepository: typeof Request, 
  private userService: UserService,
  private teamService: TeamService) {}

  async getMyNotifications(req: any) {
    return await this.requestRepository.findAll( { where: {to: req.user.id}})
  }  

  async requestJoinTeam(req: any, input: CreateRequsetDto) {
    // or recievd only 'team' in input and search manager throught team ?????????????????
    let manager;
    try {
      manager = await this.userService.getUserById(input.to);
    } catch(e) {
      throw new HttpException(RECIPIENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const requestMessage = {
      from: req.user.id,
      to: input.to,
      type: 'join',
      description: `team: ${input.team} , player: ${req.user.email}`,
    }
    
    const message = {
      to: manager.email,
      subject: 'confirm join',
      text: '',
      html: `
      <p>confirm joining team ${input.team} of player ${req.user.email}</p>
  `,
    };

    const request = await this.requestRepository.findAll({ where: {
      description: requestMessage.description, status: 'decline',type: requestMessage.type}
    });

    if (request.length === 0) {
      mailer(message);

      return await this.requestRepository.create(requestMessage);
    }
    return new HttpException(RESENDING, HttpStatus.BAD_REQUEST)

  }

  async requestLiveTeam(req: any, input: CreateRequsetDto) {
        // or recievd only 'team' in input and search manager throught team ?????????????????
        let manager;
        try {
          manager = await this.userService.getUserById(input.to);
        } catch(e) {
          throw new HttpException(RECIPIENT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    
        const requestMessage = {
          from: req.user.id,
          to: input.to,
          type: 'live',
          description: `team: ${input.team} , player: ${req.user.email}`,
        }
        
        const message = {
          to: manager.email,
          subject: 'confirm live',
          text: '',
          html: `
          <p>confirm living team ${input.team} of player ${req.user.email}</p>
      `,
        };
        const request = await this.requestRepository.findAll({ where: {
          description: requestMessage.description, status: 'decline', type: requestMessage.type}
        });
        
        if (request.length === 0) {
          mailer(message);
    
          return await this.requestRepository.create(requestMessage);
        }
        return new HttpException(RESENDING, HttpStatus.BAD_REQUEST)
  }

  async acceptJoin(input: Request) {

    // 1 because to get team name from description
    const teamName = input.description.split(' ')[1];
    const team = await this.teamService.getTeamByName(teamName);
    if (!team) {
      throw {}
    }

    // add team for user
    await this.userService.addToTeam(team, input.from);  // если true? то тогда делать метку approve .................................

    // add check on few same request ...............................................


    await this.requestRepository.update({status: 'approve'}, { where: {id: input.id } })
    return {message: 'access approve'};
  }

  async acceptLive(input: Request) {

    // 1 because to get team name from description
    const teamName = input.description.split(' ')[1];
    const team = await this.teamService.getTeamByName(teamName);
    if (!team) {
      throw {}
    }
    

    // add team for user
    await this.userService.liveTeam(team, input.from); // если true? то тогда делать метку approve ..............................

    // add check on few same request ...............................................

    await this.requestRepository.update({status: 'approve'}, { where: {id: input.id } })
    return {message: 'access live'};
  }
}
