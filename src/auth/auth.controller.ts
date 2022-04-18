import { Body, Controller, Get, Param, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @UsePipes(ValidationPipe)
  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @UsePipes(ValidationPipe)
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @Post('/forgotPassword')
  async forgotPassword(@Body() dto: CreateUserDto) {
    return this.authService.forgotPassword(dto);
  }

  @Get('/changePassword/:token')
  async getPage() {
    return 'space for new password';
  }

  @Patch('/changePassword/:token')
  async changePassword(@Param('token') token: string, @Body() input: CreateUserDto) {
    return this.userService.changePassword(input, token);
  }
}
