import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '../auth/checkRole.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeleteFromTeamDto } from './dto/delete-from-team.dto';
import { Request } from './request.model';
import { RequestService } from './request.service';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Post('join')
  @Role('manager', 'admin')
  @UseGuards(JwtAuthGuard)
  acceptJoin(@Body() input: Request) {
    return this.requestService.acceptJoin(input) 
  }
  
  @Post('leave')
  @Role('manager', 'admin')
  @UseGuards(JwtAuthGuard)
  acceptLeave(@Body() input: Request) {
    return this.requestService.acceptLeave(input) 
  }

  @Post('delete')
  @Role('manager', 'admin')
  @UseGuards(JwtAuthGuard)
  deletePlayerFromTeam(@Req() req: any, @Body() input: DeleteFromTeamDto) {
    return this.requestService.deleteFromTeam(req, input) 
  }

  @Post('acceptRegistration')
  @Role('admin')
  @UseGuards(JwtAuthGuard)
  acceptRegistrationManager(@Body() input: Request) {
    return this.requestService.acceptRegistrationManager(input) 
  }
}
