import { Body, Controller, Get, Param, Patch, Post, UseGuards, UsePipes, Req, Request } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ValidationPipe } from '../pipe/validation.pipe';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from '../user/user.service';
import { RequestService } from 'src/request/request.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, 
    private userService: UserService,
    private requestService: RequestService) {}

  @Get('/registration/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {}

  @Get('/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: any) {
    return req.user; // page with returned Login Token
  }

  @UsePipes(ValidationPipe)
  @Get('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @UsePipes(ValidationPipe)
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration({ ...userDto, registered: true });
  }

  @Post('/forgotPassword')
  async forgotPassword(@Body() dto: CreateUserDto) {
    return this.authService.forgotPassword(dto);
  }

  @Patch('/changePassword/:token')
  async changePassword(@Param('token') token: string, @Body() input: CreateUserDto) {
    return this.userService.changePassword(input, token);
  }

  @UsePipes(ValidationPipe)
  @Post('/registrationManager')
  async registrationManager(@Body() userDto: CreateUserDto) {
    await this.authService.registration({ ...userDto, registered: false })
    await this.requestService.reqSignUpManager(userDto);
  }
}
