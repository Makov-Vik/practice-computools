import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ENCODING_SALT, FAIL_WRITE_DB, LOG_USER_CREATE, NOT_AUTHORIZED, NOT_FOUND, NO_ACCESS, ROLE, ROLE_USER_NOT_FOUND, SAME_EMAIL, SUCCESS, USER_NOT_FOUND, WRONG_EMAIL } from '../constants';
import { RoleService } from '../role/role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { LogService } from '../log/log.service';
import { ChangeLoginDto } from './dto/change-login.dto';
import { UploadImageDto } from './dto/upload-image.dto';
import { includes } from 'lodash';
import { Team } from 'src/team/team.model';
import { BanDto } from './dto/ban.dto';
dotenv.config();

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RoleService, private jwtService: JwtService, private logService: LogService
  ) {}

  async createUser(dto: CreateUserDto) {
    const role = await this.roleService.getRoleByValue(ROLE[ROLE.player]);
    if(!role) {
      throw new HttpException(ROLE_USER_NOT_FOUND, HttpStatus.NOT_FOUND); 
    }
    const dtoWithRole = { ...dto, roleId: role.id, ban: false, banReason: '' };

    // log to mongo
    const message = LOG_USER_CREATE.message.concat(`${dto.email}`);
    const log = {
      message: message,
      where: 'user.servise.ts',
      type: 'create'
    }
    this.logService.create(log);
    
    return await this.userRepository.create(dtoWithRole);
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async changePassword(input: CreateUserDto, token: string) {
    let user;
    try {
      user = this.jwtService.verify(token);
    } catch {
      return new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const hashPassword = await bcrypt.hash(input.password, ENCODING_SALT);

    this.userRepository.update({ password: hashPassword }, {
      where: {
        id: user.id
      }
    });

    return await this.getUserByEmail(user.email); // may be change return to "chahged success"
  }

  async getUserById(idInput: number) {
    const user = await this.userRepository.findOne({ where: { id: idInput }, include: { all: true } });
    if(!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND); 
    }
    const { id, name, email, pathPhoto, roleId, teams } = user;

    return { id, name, email, pathPhoto, roleId, teams }
  }

  async changeLogin(input: ChangeLoginDto, req: any) {
    const user = req.user;

    const candidate = await this.getUserByEmail(input.email);
    if (candidate) {
      throw new HttpException(SAME_EMAIL, HttpStatus.BAD_REQUEST);
    }

    this.userRepository.update({ email: input.email }, {
      where: {
        id: user.id
      }
    });
    return "successfully modified"
  }

  async getMe(req: any) {
    const user = await this.userRepository.findOne({ where: {id: req.user.id}, include: { all: true }} );
    if (!user) {
      throw new UnauthorizedException(NOT_AUTHORIZED);
    }
    const {name, email, roleId, pathPhoto, teams, ban, banReason} = user;
    return {name, email, roleId, pathPhoto, teams, ban, banReason};
  }

  async uploadImage(file: UploadImageDto, req: any) {
    const user = req.user;

    this.userRepository.update({ pathPhoto: file.filename }, {
      where: {
        id: user.id
      }
    });
    return "upload success"
  }

  async getImage(req: any, res: any) {
    const user = req.user;

    return await res.sendFile(user.pathPhoto, { root: './images' })
  }

  async addToTeam(team: Team, userId: number) {
    const user = await this.userRepository.findOne({ where: {id: userId}, include: { all: true }} );
    if(!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND); 
    }

    const teamsUpdate = user.teams;
    teamsUpdate.push(team);

    // why doesn't work .save() / $add() ????????????????????????????
    user.$set('teams', teamsUpdate);
    return user;
  }

  async leaveTeam(team: any, userId: number) {
    const user = await this.userRepository.findOne({ where: {id: userId}, include: { all: true }} );
    if(!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND); 
    }
    
    const teamsUpdate = user.teams;

    const indexTeam = teamsUpdate.findIndex((item => {
      return item.getDataValue('name') === team.getDataValue('name')
    }));
    console.log(indexTeam);
    teamsUpdate.splice(indexTeam, 1);
    console.log(teamsUpdate);
    // why doesn't work .save() ????????????????????????????
    user.$set('teams', teamsUpdate);
    return user;
  }

  async ban(req: any, input: BanDto) {
    const user = await this.userRepository.findByPk(input.userId);
    if(!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND); 
    }
    if (user.roleId === ROLE.admin) {
      throw new HttpException(NO_ACCESS, HttpStatus.FORBIDDEN);
    }

    if(req.user.roleId === ROLE.manager && user.roleId === ROLE.manager){
      throw new HttpException(NO_ACCESS, HttpStatus.FORBIDDEN);
    }

    user.ban = input.ban;
    user.banReason = input.banReason;
    
    try {
      await user.save(); 
      return SUCCESS;
    } catch (e) {
      console.log(e);
      throw new HttpException(FAIL_WRITE_DB, HttpStatus.INTERNAL_SERVER_ERROR)
    }


    
  }
}
