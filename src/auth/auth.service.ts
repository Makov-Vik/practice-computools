import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import {
  WRONG_EMAIL_OR_PASS,
  ENCODING_SALT,
  SAME_EMAIL,
  WRONG_EMAIL,
  USER_NOT_FOUND,
  AUTHENTICATED_ERROR,
  LogType,
} from '../constants';
import { mailer } from '../nodemailer';
import * as dotenv from 'dotenv';
import * as env from 'env-var';
import { User } from '../user/user.model';
import { LogService } from '../log/log.service';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private logService: LogService
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    if (!user.registered) {
      throw new HttpException(AUTHENTICATED_ERROR, HttpStatus.FORBIDDEN);
    }
    // log to mongo
    const log = {
      message: `user: ${user.email} was login`,
      where: 'auth.servise.ts (login())',
      type: LogType[LogType.update]
    }
    this.logService.create(log);

    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(SAME_EMAIL, HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(userDto.password, ENCODING_SALT);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    // log to mongo
    const log = {
      message: `user: ${user.email} was registered`,
      where: 'auth.servise.ts (registration())',
      type: LogType[LogType.create]
    }
    this.logService.create(log);

    return this.generateToken(user);
  }

  async forgotPassword(dto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(dto.email).catch(_e => {
      throw new UnauthorizedException(WRONG_EMAIL)
    })

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }
    const { token } = await this.generateToken(user);
    const forgotLink = `${env.get('LINK_HOME_PAGE').required().asString()}/auth/changePassword/${token}`;

    const message = {
      to: user.email,
      subject: 'restore password',
      text: '',
      html: `
      <h3>Hello ${user.name}!</h3>
      <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
  `,
    };
    mailer(message);

    // log to mongo
    const log = {
      message: `user: ${user.email} forgot password`,
      where: 'auth.servise.ts (forgotPassword())',
      type: LogType[LogType.create]
    }
    this.logService.create(log);
  }

  private async generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      pathPhoto: user.pathPhoto,
      ban: user.ban,
      banReason: user.banReason
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (!user) {
      throw new UnauthorizedException(WRONG_EMAIL_OR_PASS);
    }
    const passwordEqual = await bcrypt.compare(userDto.password, user.password);
    if (!passwordEqual) {
      throw new UnauthorizedException(WRONG_EMAIL_OR_PASS);
    }
    return user;
  }
}
