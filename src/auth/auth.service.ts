import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import {
  WRONG_EMAIL_OR_PASS,
  ENCODING_SALT,
  SAME_EMAIL,
  WRONG_EMAIL,
} from 'src/constants';
import { mailer } from 'src/nodemailer';
import * as dotenv from 'dotenv';
import * as env from 'env-var';
import { User } from 'src/user/user.model';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
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
    return this.generateToken(user);
  }

  async forgotPassword(dto: CreateUserDto) {
    let user;
    try {
      user = await this.userService.getUserByEmail(dto.email);
    } catch (e) {
      throw new UnauthorizedException(WRONG_EMAIL);
    }

    if (!user) {
      throw {};
    }
    const token = (await this.generateToken(user)).token;
    const forgotLink = `${env.get('LINK_HOME_PAGE').asString()}/auth/changePassword/${token}`;

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
  }

  private async generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
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
