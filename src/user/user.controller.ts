import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userServise: UserService) {}

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userServise.createUser(userDto);
  }
}
