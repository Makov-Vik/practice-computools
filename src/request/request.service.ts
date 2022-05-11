import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRequsetDto } from './dto/create-request.dto';
import { Request } from './request.model';
import { UserService } from 'src/user/user.service';
import { ACCESS_APPROVE, ACCESS_CANCELED, ACCESS_LEAVE, 
  ADMIN_ID, 
  FAILED, FAIL_WRITE_DB, NO_SUCH_REQ, NO_SUCH_TEAM, 
  RECIPIENT_NOT_FOUND, RequestStatus, RequestType, 
  REQUEST_CANCELED, REQUEST_JOIN, REQUEST_LEAVE, 
  REQUEST_NOT_FOUND, REQUEST_WAS_APPROVED, 
  REQUEST_WAS_DECLINE, RESENDING, SUCCESS, USER_NOT_FOUND } from 'src/constants';
import { TeamService } from 'src/team/team.service';
import { RequsetDto } from './dto/request.dto';
import { DeleteFromTeamDto } from './dto/delete-from-team.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

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
    
    const description =  `team: ${input.team} , player: ${req.user.email}`;

    const requests = await this.requestRepository.findAll({ where: {
      description: description, status: RequestStatus.pending ,type: RequestType.join}
    });

    if (requests.length === 0) {
      try {
        return await this.requestRepository.create({ 
        ...REQUEST_JOIN,
        from: req.user.id,
        to: input.to,
        description: description,
        });
      } catch(e) {
        console.log(e)
        throw new HttpException(FAIL_WRITE_DB, HttpStatus.INTERNAL_SERVER_ERROR)
      }

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
    
        const description = `team: ${input.team} , player: ${req.user.email}`;

        const requests = await this.requestRepository.findAll({ where: {
          description: description, status: RequestStatus.pending, type: RequestType.leave}
        });
        
        if (requests.length === 0) {
          return await this.requestRepository.create({ 
            ...REQUEST_LEAVE,
            from: req.user.id,
            to: input.to,
            description: description,
          });
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

  async deleteFromTeam(req: any, input: DeleteFromTeamDto) {
    try {
      await this.requestRepository.create({ 
      type: RequestType.leave,
      status: RequestStatus.approve,
      from: req.user.id,
      to: req.user.id,
      description: input.description,
    });

    const team = await this.teamService.getTeamByName(input.team);
    await this.userService.leaveTeam(team, input.player);

    } catch (e) {
      console.log(e);
      throw new HttpException(FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return SUCCESS
  }

  async reqSignUpManager(input: CreateUserDto) {
    const manager = await this.userService.getUserByEmail(input.email);

    if (!manager) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    try {    
      return await this.requestRepository.create({ 
      type: RequestType.signup,
      status: RequestStatus.pending,
      from: manager.id,
      to: ADMIN_ID,
      description: 'manager registration request',
      });
    } catch(e) {
      console.log(e)
      throw new HttpException(FAIL_WRITE_DB, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async acceptRegistrationManager(input: Request) {
    const request =  await this.requestRepository.findOne({ where: { id: input.id }});
    if (!request) {
      throw new HttpException(NO_SUCH_REQ, HttpStatus.NOT_FOUND);
    }

    await this.requestRepository.update({status: input.status}, { where: { id: input.id }});
    
    if (input.status = RequestStatus.approve) {
      await this.userService.acceptRegisteredManager(request.from)
    }
  }
}
