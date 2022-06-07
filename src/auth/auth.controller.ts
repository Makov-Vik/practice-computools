import { Body, Controller, Get, Param, Patch, Post, UseGuards, UsePipes, Req, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ValidationPipe } from '../pipe/validation.pipe';
import { UserService } from '../user/user.service';
import { RequestService } from '../request/request.service';
import { AuthGuard } from '@nestjs/passport';
import * as Response from '../response.messages';
import * as express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, 
    private userService: UserService,
    private requestService: RequestService) {}

  @Get('/registration/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: express.Request) {}

  @Get('/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: express.Request) {
    return req.user;
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
    const admin = await this.userService.getAdmin();
    if(!admin) {
      return new HttpException(Response.RECIPIENT_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
    await this.authService.registration({ ...userDto, registered: false })
    return await this.requestService.reqSignUpManager(userDto, admin);
  }
}
