import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRequsetDto } from './dto/create-request.dto';
import { Request } from './request.model';
import { UserService } from '../user/user.service';
import { LogType, RequestStatus, RequestType, REQUEST_JOIN, REQUEST_LEAVE } from '../constants';
import { TeamService } from '../team/team.service';
import { RequsetDto } from './dto/request.dto';
import { DeleteFromTeamDto } from './dto/delete-from-team.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LogService } from '../log/log.service';
import { User } from '../user/user.model';
import * as Response from '../response.messages';
import { EventGateway } from '../events/events.gateway';
import { RequestdWithUser } from 'request-type';

@Injectable()
export class RequestService {
  constructor(@InjectModel(Request) private requestRepository: typeof Request, 
  private userService: UserService,
  private teamService: TeamService,
  private logService: LogService,
  private readonly eventGateway: EventGateway) {}

  async getMyNotifications(req: RequestdWithUser) {
    return await this.requestRepository.findAll( { where: {to: req.user.id}})
  }

  async getMyMessages(req: RequestdWithUser) {
    return await this.requestRepository.findAll( { where: {from: req.user.id}})
  }

  async requestJoinTeam(req: RequestdWithUser, input: CreateRequsetDto) {
    const team = await this.teamService.getTeamByName(input.team);
    if(!team) {
      throw new HttpException(Response.NO_SUCH_TEAM, HttpStatus.NOT_FOUND);
    }
    
    let manager;
    try {
      manager = await this.userService.getUserById(input.to);

      if (manager.id !== team.headManager) {
        throw new HttpException(Response.RECIPIENT_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
    } catch(e) {
      throw new HttpException(Response.RECIPIENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const description =  `team: ${team.name} , player: ${req.user.email}`;

    const requests = await this.requestRepository.findAll({ where: {
      description: description, status: RequestStatus.PENDING ,type: RequestType.JOIN}
    });

    if (requests.length === 0) {
      try {
        const request = await this.requestRepository.create({ 
        ...REQUEST_JOIN,
        from: req.user.id,
        to: input.to,
        description: description,
        });
        
        const log = {
          message: `request join team user ${req.user.email}`,
          where: 'request.servise.ts (requestJoinTeam())',
          type: LogType.CREATE
        }
        await this.logService.create(log);

        this.eventGateway.forAdmin({ from: req.user.id, description, type: RequestType[RequestType.JOIN] });
        this.eventGateway.forManager(input.to, { from: req.user.id, description, type: RequestType[RequestType.JOIN] });

        return request;
      } catch(e) {
        
        const log = {
          message: `faild write into db. ${e}`,
          where: 'request.servise.ts (requestJoinTeam())',
          type: LogType.ERROR
        }
        await this.logService.create(log);
        throw new HttpException(Response.FAIL_WRITE_DB, HttpStatus.INTERNAL_SERVER_ERROR)
      }

    }
    return new HttpException(Response.RESENDING, HttpStatus.BAD_REQUEST)

  }

  async requestLeaveTeam(req: RequestdWithUser, input: CreateRequsetDto) {
    const team = await this.teamService.getTeamByName(input.team);
    if(!team) {
      throw new HttpException(Response.NO_SUCH_TEAM, HttpStatus.NOT_FOUND);
    }
    
    let manager;
    try {
      manager = await this.userService.getUserById(input.to);

      if (manager.id !== team.headManager) {
        throw new HttpException(Response.RECIPIENT_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
    } catch(e) {
      throw new HttpException(Response.RECIPIENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const description = `team: ${team.name} , player: ${req.user.email}`;

    const requests = await this.requestRepository.findAll({ where: {
      description: description, status: RequestStatus.PENDING, type: RequestType.LEAVE}
    });
    
    if (requests.length === 0) {
      try {
        const request = await this.requestRepository.create({ 
          ...REQUEST_LEAVE,
          from: req.user.id,
          to: input.to,
          description: description,
        });

        const log = {
          message: `request leave team user ${req.user.email}`,
          where: 'request.servise.ts (requestJoinTeam())',
          type: LogType.CREATE
        }
        await this.logService.create(log);

        this.eventGateway.forAdmin({ from: req.user.id, description, type: RequestType[RequestType.LEAVE] });
        this.eventGateway.forManager(input.to, { from: req.user.id, description, type: RequestType[RequestType.LEAVE] });

        return request;         
      } catch(e) {
        
        const log = {
          message: `faild write into db. ${e}`,
          where: 'request.servise.ts (requestLeaveTeam())',
          type: LogType.ERROR
        }
        await this.logService.create(log);
      }

    }
    return new HttpException(Response.RESENDING, HttpStatus.BAD_REQUEST)
  }

  async acceptJoin(input: Request) {

    const request =  await this.requestRepository.findOne({ attributes: ['status'], where: { id: input.id }});
    if (!request) {
      throw new HttpException(Response.NO_SUCH_REQ, HttpStatus.NOT_FOUND);
    }
    if (request.getDataValue('status') === RequestStatus.CANCELED) {
      throw new HttpException(Response.REQUEST_CANCELED, HttpStatus.BAD_REQUEST);
    }    

    // 1 because to get team name from description
    // example: input.description = 'team: <team> , player: <player>'
    const teamName = input.description.split(' ')[1];
    const team = await this.teamService.getTeamByName(teamName);
    if (!team) {
      throw new HttpException(Response.NO_SUCH_TEAM, HttpStatus.BAD_REQUEST);
    }

    try {
      await this.requestRepository.update({status: input.status}, { where: { id: input.id }});
      
      if (input.status === RequestStatus.DECLINE) {
        return Response.SUCCESS
      } 
      else {
        const successAdding = await this.userService.addToTeam(team, input.from);
        if(!successAdding) {
          return new HttpException(Response.FAILED_CHANGE_REQ, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const log = {
          message: `accept request join team: ${teamName}, user: ${input.from}`,
          where: 'request.servise.ts (requestJoinTeam())',
          type: LogType.CREATE
        }
        await this.logService.create(log);
        
        this.eventGateway.forAdmin({
          from: input.from,
          description: input.description,
          type: RequestType[RequestType.JOIN],
          status: RequestStatus[input.status] 
        });
        this.eventGateway.forPlayer(input.from, { 
          from: input.from,
          description: input.description,
          type: RequestType[RequestType.JOIN],
          status: RequestStatus[input.status] 
        });

        return Response.SUCCESS;
      }
    } catch(e) {
      
      const log = {
        message: `failed adding to team user: ${input.from}. ${e}`,
        where: 'request.servise.ts (acceptJoin())',
        type: LogType.ERROR
      }
      await this.logService.create(log);

      throw new HttpException(Response.FAIL_WRITE_DB, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async acceptLeave(input: Request) {

    const request =  await this.requestRepository.findOne({ attributes: ['status'], where: { id: input.id }});
    if (!request) {
      throw new HttpException(Response.NO_SUCH_REQ, HttpStatus.NOT_FOUND);
    }
    if (request.getDataValue('status') === RequestStatus.CANCELED) {
      throw new HttpException(Response.REQUEST_CANCELED, HttpStatus.BAD_REQUEST);
    }    

    // 1 because to get team name from description
    const teamName = input.description.split(' ')[1];
    const team = await this.teamService.getTeamByName(teamName);
    if (!team) {
      throw new HttpException(Response.NO_SUCH_TEAM, HttpStatus.BAD_REQUEST);
    }
    
    try {
      await this.requestRepository.update({status: input.status}, { where: {id: input.id } });
      
      if (input.status === RequestStatus.DECLINE) {
        return Response.SUCCESS
      }
      else {
        const successLeaving = await this.userService.leaveTeam(team, input.from);
        if(!successLeaving) {
          return new HttpException(Response.FAILED_CHANGE_REQ, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const log = {
          message: `accept leave join team: ${teamName}, user: ${input.from}`,
          where: 'request.servise.ts (acceptLeave())',
          type: LogType.CREATE
        }
        await this.logService.create(log);

        this.eventGateway.forAdmin({
          from: input.from,
          description: input.description,
          type: RequestType[RequestType.LEAVE],
          status: RequestStatus[input.status] 
        });
        this.eventGateway.forPlayer(input.from, { 
          from: input.from,
          description: input.description,
          type: RequestType[RequestType.LEAVE],
          status: RequestStatus[input.status] 
        });

        return Response.SUCCESS;
      }
    } catch(e) {
      
      const log = {
        message: `failed leaving from team user: ${input.from}. ${e}`,
        where: 'request.servise.ts (acceptLeave())',
        type: LogType.ERROR
      }
      await this.logService.create(log);
      return Response.FAILED
    }
  }

  async cancelRequest(input: RequsetDto) {

    const request = await this.requestRepository.findOne({ where: { id: input.id }});

    if (!request) {
      throw new HttpException(Response.REQUEST_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (request.getDataValue('status') === RequestStatus.APPROVE) {
      return new HttpException(Response.REQUEST_WAS_APPROVED, HttpStatus.BAD_REQUEST);
    }

    if (request.getDataValue('status') === RequestStatus.DECLINE) {
      return new HttpException(Response.REQUEST_WAS_DECLINE, HttpStatus.BAD_REQUEST);
    }
    
    try {
      await this.requestRepository.update({status: RequestStatus.CANCELED}, { where: { id: input.id }});

      const log = {
        message: `canclede request from id: ${request.from}`,
        where: 'request.servise.ts (cancelRequest())',
        type: LogType.UPDATE
      }
      await this.logService.create(log);
    } catch(e) {
      
      const log = {
        message: `faild write into db. ${e}`,
        where: 'request.servise.ts (cancelRequest())',
        type: LogType.ERROR
      }
      await this.logService.create(log);
    }
    return Response.ACCESS_CANCELED;
  }

  async deleteFromTeam(req: RequestdWithUser , input: DeleteFromTeamDto) {
    try {
      await this.requestRepository.create({ 
      type: RequestType.LEAVE,
      status: RequestStatus.APPROVE,
      from: req.user.id,
      to: req.user.id,
      description: input.description,
    });

    const team = await this.teamService.getTeamByName(input.team);
    await this.userService.leaveTeam(team, input.player);

    const log = {
      message: `leave from team: ${team}, user id: ${input.player}`,
      where: 'request.servise.ts (deleteFromTeam())',
      type: LogType.CREATE
    }
    await this.logService.create(log);
    } catch (e) {
      
      const log = {
        message: `faild write into db. ${e}`,
        where: 'request.servise.ts (deleteFromTeam())',
        type: LogType.ERROR
      }
      await this.logService.create(log);
      throw new HttpException(Response.FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.eventGateway.forAdmin({
      from: req.user.id,
      description: input.description,
      type: RequestType[RequestType.LEAVE],
      status: RequestStatus[RequestStatus.APPROVE] 
    });
    this.eventGateway.forPlayer(input.player, { 
      from: req.user.id,
      description: input.description,
      type: RequestType[RequestType.LEAVE],
      status: RequestStatus[RequestStatus.APPROVE] 
    });

    return Response.SUCCESS
  }

  async reqSignUpManager(input: CreateUserDto, admin: User | null | undefined) {
    const manager = await this.userService.getUserByEmail(input.email);

    if (!manager) {
      return new HttpException(Response.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if(!admin) {
      return new HttpException(Response.RECIPIENT_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
    
    try {
      const request = { 
      type: RequestType.SIGNUP,
      status: RequestStatus.PENDING,
      from: manager.id,
      to: admin.id,
      description: `manager registration request from ${input.email}`,
      };
      const createdRequest = await this.requestRepository.create(request);

      const log = {
        message: `manager registration request from: ${manager.id}`,
        where: 'request.servise.ts (reqSignUpManager())',
        type: LogType.CREATE
      }
      await this.logService.create(log);


      this.eventGateway.forAdmin({
        ...request,
        type: RequestType[RequestType.SIGNUP],
        status: RequestStatus[RequestStatus.PENDING]
      });

      return createdRequest;
    } catch(e) {
      
      const log = {
        message: `faild write into db. ${e}`,
        where: 'request.servise.ts (reqSignUpManager())',
        type: LogType.ERROR
      }
      await this.logService.create(log);
      throw new HttpException(Response.FAIL_WRITE_DB, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async acceptRegistrationManager(input: Request) {
    const request =  await this.requestRepository.findOne({ where: { id: input.id }});
    if (!request) {
      throw new HttpException(Response.NO_SUCH_REQ, HttpStatus.NOT_FOUND);
    }

    try {
      await this.requestRepository.update({status: input.status}, { where: { id: input.id }});
      
      if (input.status = RequestStatus.APPROVE) {
        await this.userService.acceptRegisteredManager(request.from)
      }

      const log = {
        message: `manager registration request was: ${input.status}`,
        where: 'request.servise.ts (acceptRegistrationManager())',
        type: LogType.UPDATE
      }
      await this.logService.create(log);
      
      return Response.SUCCESS
    } catch(e) {
      
      const log = {
        message: `faild write into db. ${e}`,
        where: 'request.servise.ts (acceptRegistrationManager())',
        type: LogType.ERROR
      }
      await this.logService.create(log);
    }
  }
}
