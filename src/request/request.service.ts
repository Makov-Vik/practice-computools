import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRequsetDto } from './dto/create-request.dto';
import { Request } from './request.model';
import { mailer } from '../nodemailer';
import { UserService } from 'src/user/user.service';
import { ACCESS_APPROVE, ACCESS_CANCELED, ACCESS_LEAVE, MESSAGE, NO_SUCH_REQ, NO_SUCH_TEAM, RECIPIENT_NOT_FOUND, RequestStatus, RequestType, REQUEST_CANCELED, REQUEST_NOT_FOUND, REQUEST_WAS_APPROVED, REQUEST_WAS_DECLINE, RESENDING } from 'src/constants';
import { TeamService } from 'src/team/team.service';
import { User } from 'src/user/user.model';
import { RequsetDto } from './dto/request.dto';

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
      console.log(await this.userService.getUserById(input.to))
      throw new HttpException(RECIPIENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    

    const requestMessage = {
      from: req.user.id,
      to: input.to,
      type: RequestType.join,
      status: RequestStatus.pending,
      description: `team: ${input.team} , player: ${req.user.email}`,
    }

    const requests = await this.requestRepository.findAll({ where: {
      description: requestMessage.description, status: requestMessage.status ,type: requestMessage.type}
    });

    if (requests.length === 0) {
      mailer({
        ...MESSAGE, 
        to: manager.email,
        html: `<p>confirm joining team ${input.team} of player ${req.user.email}</p>`
      });

      return await this.requestRepository.create(requestMessage);
    }
    return new HttpException(RESENDING, HttpStatus.BAD_REQUEST)

  }

  async requestLeaveTeam(req: any, input: CreateRequsetDto) {
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
          type: RequestType.leave,
          status: RequestStatus.pending,
          description: `team: ${input.team} , player: ${req.user.email}`,
        }

        const requests = await this.requestRepository.findAll({ where: {
          description: requestMessage.description, status: requestMessage.status, type: requestMessage.type}
        });
        
        if (requests.length === 0) {
          mailer({
            ...MESSAGE, 
            to: manager.email,
            html: `<p>confirm leaving team ${input.team} of player ${req.user.email}</p>`
          });
    
          return await this.requestRepository.create(requestMessage);
        }
        return new HttpException(RESENDING, HttpStatus.BAD_REQUEST)
  }

  async acceptJoin(input: Request) {

    const request =  await this.requestRepository.findOne({ attributes: ['status'], where: { id: input.id }});
    if (!request) {
      throw new HttpException(NO_SUCH_REQ, HttpStatus.NOT_FOUND);
    }
    if (request.getDataValue('status') === RequestStatus.canceled) {
      throw new HttpException(REQUEST_CANCELED, HttpStatus.BAD_REQUEST);
    }    

    // 1 because to get team name from description
    const teamName = input.description.split(' ')[1];
    const team = await this.teamService.getTeamByName(teamName);
    if (!team) {
      throw new HttpException(NO_SUCH_TEAM, HttpStatus.BAD_REQUEST);
    }

    // add team for user
    await this.userService.addToTeam(team, input.from);  // если true? то тогда делать метку approve .................................

    await this.requestRepository.update({status: RequestStatus.approve}, { where: { id: input.id }})
    return ACCESS_APPROVE;
  }

  async acceptLeave(input: Request) {

    const request =  await this.requestRepository.findOne({ attributes: ['status'], where: { id: input.id }});
    if (!request) {
      throw new HttpException(NO_SUCH_REQ, HttpStatus.NOT_FOUND);
    }
    if (request.getDataValue('status') === RequestStatus.canceled) {
      throw new HttpException(REQUEST_CANCELED, HttpStatus.BAD_REQUEST);
    }    

    // 1 because to get team name from description
    const teamName = input.description.split(' ')[1];
    const team = await this.teamService.getTeamByName(teamName);
    if (!team) {
      throw new HttpException(NO_SUCH_TEAM, HttpStatus.BAD_REQUEST);
    }
    
    // add team for user
    await this.userService.leaveTeam(team, input.from); // если true? то тогда делать метку approve ..............................

    await this.requestRepository.update({status: RequestStatus.approve}, { where: {id: input.id } })
    return ACCESS_LEAVE;
  }

  async cancelRequest(_req: any, input: RequsetDto) {

    const request = await this.requestRepository.findOne({ where: { id: input.id }});

    if (!request) {
      throw new HttpException(REQUEST_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (request.getDataValue('status') === RequestStatus.approve) {
      return new HttpException(REQUEST_WAS_APPROVED, HttpStatus.BAD_REQUEST);
    }

    if (request.getDataValue('status') === RequestStatus.decline) {
      return new HttpException(REQUEST_WAS_DECLINE, HttpStatus.BAD_REQUEST);
    }
    
    await this.requestRepository.update({status: RequestStatus.canceled}, { where: { id: input.id }});
    return ACCESS_CANCELED;
  }
}
