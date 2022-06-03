import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ENCODING_SALT, LogType, ROLE } from '../constants';
import { RoleService } from '../role/role.service';
import * as Response from '../response.messages';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { LogService } from '../log/log.service';
import { ChangeLoginDto } from './dto/change-login.dto';
import { UploadImageDto } from './dto/upload-image.dto';
import { Team } from '../team/team.model';
import { BanDto } from './dto/ban.dto';
import * as env from 'env-var';
dotenv.config({path: `.${env.get('NODE_ENV').required().asString()}.env`});

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private jwtService: JwtService, private logService: LogService
  ) {}

  async createUser(dto: CreateUserDto) {
    let role;
    if(dto.registered) {
      role = ROLE.PLAYER;
    }
    else {
      role = ROLE.MANAGER;
    }
    if(!role) {
      //log to mongo
      const log = {
        message: Response.ROLE_USER_NOT_FOUND.message,
        where: 'user.servise.ts (createUser())',
        type: LogType.ERROR
      }
      await this.logService.create(log);

      throw new HttpException(Response.ROLE_USER_NOT_FOUND, HttpStatus.NOT_FOUND); 
    }
    const dtoWithRole = { ...dto, roleId: role, ban: false, banReason: '' };

    // log to mongo
    const message = Response.LOG_USER_CREATE.message.concat(`${dto.email}`);
    const log = {
      message: message,
      where: 'user.servise.ts (createUser())',
      type: LogType.CREATE
    }
    await this.logService.create(log);
    
    return await this.userRepository.create(dtoWithRole);
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email }, include: {all: true} });
  }

  async getUserByEmailShort(emailInput: string) {
    const user = await this.userRepository.findOne({
      attributes: ['id', 'name', 'email', 'roleId', 'pathPhoto', 'teams', 'ban', 'banReason'],
      where: { email: emailInput }, include: {all: true} 
    });
    if(!user) {
      throw new HttpException(Response.USER_NOT_FOUND, HttpStatus.NOT_FOUND); 
    }
    return user;
  }

  async changePassword(input: CreateUserDto, token: string) {
    let user;
    try {
      user = this.jwtService.verify(token);
    } catch {
      // log to mongo
      const log = {
        message: `fail verify token`,
        where: 'user.servise.ts (changePassword())',
        type: LogType.ERROR
      }
      await this.logService.create(log);
      
      return new HttpException(Response.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const hashPassword = await bcrypt.hash(input.password, ENCODING_SALT);

    this.userRepository.update({ password: hashPassword }, {
      where: {
        id: user.id
      }
    });

    // log to mongo
    const log = {
      message: `user ${user.email} changed password`,
      where: 'user.servise.ts (changePassword())',
      type: LogType.UPDATE
    }
    await this.logService.create(log);

    return await this.getUserByEmail(user.email); // may be change return to "changed success"
  }

  async getUserById(idInput: number) {
    const user = await this.userRepository.findOne({ where: { id: idInput }, include: { all: true } });
    if(!user) {
      throw new HttpException(Response.USER_NOT_FOUND, HttpStatus.NOT_FOUND); 
    }
    return user;
  }

  async changeLogin(input: ChangeLoginDto, req: any) {
    const user = req.user;

    const candidate = await this.getUserByEmail(input.email);
    if (candidate) {
      throw new HttpException(Response.SAME_EMAIL, HttpStatus.BAD_REQUEST);
    }

    try {
      this.userRepository.update({ email: input.email }, {
      where: {
        id: user.id
      }
      });
    } catch(e) {
      // log to mongo
      const log = {
        message: `faild write into db. ${e}`,
        where: 'user.servise.ts (changeLogin())',
        type: LogType.ERROR
      }
      await this.logService.create(log);
    }
 

    // log to mongo
    const log = {
      message: `user ${user.email} changed password`,
      where: 'user.servise.ts (changeLogin())',
      type: LogType.UPDATE
    }
    await this.logService.create(log);
    return Response.SUCCESS
  }

  async getMe(req: any) {
    const user = await this.userRepository.findOne({
      attributes: ['id', 'name', 'email', 'roleId', 'pathPhoto', 'teams', 'ban', 'banReason'],
      where: {id: req.user.id}, include: { all: true }
    });
    if (!user) {
      throw new UnauthorizedException(Response.NOT_AUTHORIZED);
    };
    return user;
  }

  async uploadImage(file: UploadImageDto, req: any) {
    const user = req.user;
    try {
      this.userRepository.update({ pathPhoto: file.filename }, {
        where: {
          id: user.id
        }
      });      
    } catch(e) {
     // log to mongo
     const log = {
      message: `faild update db. ${e}`,
      where: 'user.servise.ts (uploadImage())',
      type: LogType.ERROR
      }
      await this.logService.create(log);
      
      throw new HttpException(Response.FAIL_WRITE_DB, HttpStatus.BAD_REQUEST);
    }

    return Response.SUCCESS
  }

  async getImage(req: any, res: any) {
    const user = await this.userRepository.findOne({ where: {id: req.user.id} });

    return await res.sendFile(user?.pathPhoto, { root: './images' })
  }

  async addToTeam(team: Team, userId: number) {
    const user = await this.userRepository.findOne({ where: {id: userId}, include: { all: true }} );
    if(!user) {
      throw new HttpException(Response.USER_NOT_FOUND, HttpStatus.NOT_FOUND); 
    }

    const teamsUpdate = user.teams;
    teamsUpdate.push(team);


    // why doesn't work .save() / $add() ????????????????????????????
    try {
      await user.$set('teams', teamsUpdate);
      
      // log to mongo
      const log = {
      message: `add to team ${team} user ${user.email}`,
      where: 'user.servise.ts (addToTeam())',
      type: LogType.UPDATE
      }
      await this.logService.create(log); 

      return true;
    } catch(e) {
      // log to mongo
      const log = {
      message: `faild update db. ${e}`,
      where: 'user.servise.ts (addToTeam())',
      type: LogType.ERROR
      }
      await this.logService.create(log);
 
      return false
    }
  }

  async leaveTeam(team: any, userId: number) {
    const user = await this.userRepository.findOne({ where: {id: userId}, include: { all: true }} );
    if(!user) {
      throw new HttpException(Response.USER_NOT_FOUND, HttpStatus.NOT_FOUND); 
    }
    
    const teamsUpdate = user.teams;

    const indexTeam = teamsUpdate.findIndex((item => {
      return item.getDataValue('name') === team.getDataValue('name')
    }));
    if (indexTeam === -1) {
      throw new HttpException(Response.NO_SUCH_TEAM, HttpStatus.BAD_REQUEST);
    }
    teamsUpdate.splice(indexTeam, 1);

    try {
      await user.$set('teams', teamsUpdate);
      // log to mongo
      const log = {
        message: `leave from team ${team} user ${user.email}`,
        where: 'user.servise.ts (addToTeam())',
        type: LogType.ERROR
      }
      await this.logService.create(log);

      return user;
    } catch(e) {
      // log to mongo
      const log = {
        message: `faild leave team from db. ${e}`,
        where: 'user.servise.ts (leaveTeam())',
        type: LogType.ERROR
        }
        await this.logService.create(log);  
    }
  }

  async ban(req: any, input: BanDto) {
    const user = await this.userRepository.findByPk(input.userId);
    if(!user) {
      throw new HttpException(Response.USER_NOT_FOUND, HttpStatus.NOT_FOUND); 
    }
    if (user.roleId === ROLE.ADMIN) {
      throw new HttpException(Response.NO_ACCESS, HttpStatus.FORBIDDEN);
    }

    if(req.user.roleId === ROLE.MANAGER && user.roleId === ROLE.MANAGER){
      throw new HttpException(Response.NO_ACCESS, HttpStatus.FORBIDDEN);
    }

    user.ban = input.ban;
    user.banReason = input.banReason;
    
    try {
      await user.save(); 
      // log to mongo
      const log = {
        message: `user ${user.email} was ban: ${input.ban}`,
        where: 'user.servise.ts (ban())',
        type: LogType.UPDATE
      }
      await this.logService.create(log);  
      return Response.SUCCESS;
    } catch (e) {
      // log to mongo
      const log = {
      message: `faild write into db ${e}`,
      where: 'user.servise.ts (ban())',
      type: LogType.ERROR
      }
      await this.logService.create(log);  
      throw new HttpException(Response.FAIL_WRITE_DB, HttpStatus.INTERNAL_SERVER_ERROR)
    } 
  }

  async acceptRegisteredManager(id: number) {
    try {
      await this.userRepository.update({ registered: true}, { where: { id: id } });
      // log to mongo
      const log = {
        message: `manager was accept registered`,
        where: 'user.servise.ts (acceptRegisteredManager())',
        type: LogType.UPDATE
        }
      await this.logService.create(log);  
    } catch(e) {
      // log to mongo
      const log = {
        message: `faild write into db ${e}`,
        where: 'user.servise.ts (acceptRegisteredManager())',
        type: LogType.ERROR
        }
      await  this.logService.create(log);  
    }
  }

  async getAdmin() {
    try {
      const admin = await this.userRepository.findOne({ where: {roleId: ROLE.ADMIN}});
      return admin
    } catch(e) {
      // log to mongo
      const log = {
        message: `faild write into db ${e}`,
        where: 'user.servise.ts (getAdmin())',
        type: LogType.ERROR
      }
      await this.logService.create(log);  
    }
  }

  async getAllManagers() {
    return await this.userRepository.findAll({ 
      attributes: ['id', 'name', 'email', 'roleId', 'pathPhoto', 'teams', 'ban', 'banReason'],
      where: {roleId: ROLE.MANAGER }
    });
  }
}
