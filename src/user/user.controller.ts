import { Body, Controller, Post, Get, Patch, UsePipes, UseInterceptors, UploadedFile, UseGuards, Res, Req  } from '@nestjs/common';
import { ValidationPipe } from '../pipe/validation.pipe';
import { ChangeLoginDto } from './dto/change-login.dto';
import { User } from './user.model';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './util/image-upload.util';
import { UploadImageDto } from './dto/upload-image.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRequsetDto } from '../request/dto/create-request.dto';
import { RequestService } from '../request/request.service';
import { RequsetDto } from '../request/dto/request.dto';
import { BanDto } from './dto/ban.dto';
import { Role } from '../auth/checkRole.decorator';
import { Request } from 'express';
import { ROLE } from '../constants';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private requestService: RequestService) {}

  @Get()
  getUserById(@Body() input: User) {
    return this.userService.getUserById(input.id);
  }

  @Get('/byEmail')
  @UseGuards(JwtAuthGuard)
  getUserByEmail(@Body() input: any) {
    return this.userService.getUserByEmailShort(input.email);
  }

  @Patch('changeLogin')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  changeLogin(@Body() input: ChangeLoginDto, @Req() req: Request) {
    return this.userService.changeLogin(input, req);
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request) {
    return this.userService.getMe(req);
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
  uploadImage(@UploadedFile() file: UploadImageDto, @Req() req: Request) {
    return this.userService.uploadImage(file, req);
  }

  @Get('image')
  @UseGuards(JwtAuthGuard)
  getImage(@Req() req: Request, @Res() res: any) {
    return this.userService.getImage(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('myNotifications')
  getMyNotifications(@Req() req: Request) {
    return this.requestService.getMyNotifications(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('myMessages')
  getMyMessages(@Req() req: Request) {
    return this.requestService.getMyMessages(req);
  }

  @Post('joinTeam')
  @UseGuards(JwtAuthGuard)
  requestJoinTeam(@Req() req: Request, @Body() input: CreateRequsetDto) {
    return this.requestService.requestJoinTeam(req, input);
  }

  @Post('leaveTeam')
  @UseGuards(JwtAuthGuard)
  requestLeaveTeam(@Req() req: Request, @Body() input: CreateRequsetDto) {
    return this.requestService.requestLeaveTeam(req, input);
  }

  @Post('cancelRequest')
  @UseGuards(JwtAuthGuard)
  cancelRequest(@Req() req: Request, @Body() input: RequsetDto) {
    return this.requestService.cancelRequest(req, input);
  }

  @Patch('ban')
  @Role(ROLE[ROLE.ADMIN], ROLE[ROLE.MANAGER])
  @UseGuards(JwtAuthGuard)
  ban(@Req() req: Request, @Body() input: BanDto) {
    return this.userService.ban(req, input);
  }


  @Get('getManagers')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  getAllManagers() {
    return this.userService.getAllManagers();
  }
}
