import { Body, Controller, Post, Get, Put, Patch, Param, Headers, UsePipes, UseInterceptors, UploadedFile, UseGuards, Res, Req  } from '@nestjs/common';
import { ValidationPipe } from '../pipe/validation.pipe';
import { ChangeLoginDto } from './dto/change-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './util/image-upload.util';
import { UploadImageDto } from './dto/upload-image.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRequsetDto } from 'src/request/dto/create-request.dto';
import { RequestService } from 'src/request/request.service';
import { RequsetDto } from 'src/request/dto/request.dto';

@Controller('user')
export class UserController {
  constructor(private userServise: UserService, private requestService: RequestService) {}

  @Get()
  getUserById(@Body() input: User) {
    return this.userServise.getUserById(input.id);
  }

  @Patch('changeLogin')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  changeLogin(@Body() input: ChangeLoginDto, @Req() req: any) {
    return this.userServise.changeLogin(input, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    return this.userServise.getMe(req);
  }

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadImage(@UploadedFile() file: UploadImageDto, @Req() req: any) {
    return this.userServise.uploadImage(file, req);
  }

  @Get('image')
  @UseGuards(JwtAuthGuard)
  getImage(@Req() req: any, @Res() res: any) {
    return this.userServise.getImage(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('myNotifications')
  getMyNotifications(@Req() req: any) {
    return this.requestService.getMyNotifications(req);
  }

  @Post('joinTeam')
  @UseGuards(JwtAuthGuard)
  requestJoinTeam(@Req() req: any, @Body() input: CreateRequsetDto) {
    return this.requestService.requestJoinTeam(req, input);
  }

  @Post('leaveTeam')
  @UseGuards(JwtAuthGuard)
  requestLeaveTeam(@Req() req: any, @Body() input: CreateRequsetDto) {
    return this.requestService.requestLeaveTeam(req, input);
  }

  @Post('cancelRequest')
  @UseGuards(JwtAuthGuard)
  cancelRequest(@Req() req: any, @Body() input: RequsetDto) {
    return this.requestService.cancelRequest(req, input);
  }

}
