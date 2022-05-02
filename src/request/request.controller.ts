import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/checkRole.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { Request } from './request.model';
import { RequestService } from './request.service';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Post('join')
  @Role('manager')
  @UseGuards(RoleGuard)
  acceptJoin(@Body() input: Request) {
    return this.requestService.acceptJoin(input) 
  }
  
  @Post('live')
  @Role('manager')
  @UseGuards(RoleGuard)
  acceptLive(@Body() input: Request) {
    return this.requestService.acceptLive(input) 
  }
}
