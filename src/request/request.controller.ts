import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '../auth/checkRole.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeleteFromTeamDto } from './dto/delete-from-team.dto';
import { Request } from './request.model';
import { RequestService } from './request.service';
import { ROLE } from '../constants';
import { RequestdWithUser } from 'request-type';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Post('join')
  @Role(ROLE[ROLE.MANAGER], ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  acceptJoin(@Body() input: Request) {
    return this.requestService.acceptJoin(input) 
  }
  
  @Post('leave')
  @Role(ROLE[ROLE.MANAGER], ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  acceptLeave(@Body() input: Request) {
    return this.requestService.acceptLeave(input) 
  }

  @Post('delete')
  @Role(ROLE[ROLE.MANAGER], ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  deletePlayerFromTeam(@Req() req: RequestdWithUser, @Body() input: DeleteFromTeamDto) {
    return this.requestService.deleteFromTeam(req, input) 
  }

  @Post('acceptRegistration')
  @Role(ROLE[ROLE.ADMIN])
  @UseGuards(JwtAuthGuard)
  acceptRegistrationManager(@Body() input: Request) {
    return this.requestService.acceptRegistrationManager(input) 
  }
}
