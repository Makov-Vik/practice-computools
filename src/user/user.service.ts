import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ENCODING_SALT, NOT_FOUND, WRONG_EMAIL } from 'src/constants';
import { RoleService } from 'src/role/role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RoleService, private jwtService: JwtService
  ) {}

  async createUser(dto: CreateUserDto) {
    // enum plauer
    const role = await this.roleService.getRoleByValue('player');
    const dtoWithRole = { ...dto, roleId: role.id };

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

    return await this.getUserByEmail(user.email);
  }
}
