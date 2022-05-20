import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { Role } from '../auth/checkRole.decorator';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Role('manager')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTeamDto, @Req() req: any) {
    return this.teamService.createTeam(dto, req);
  }

  @Get('/:name')
  getByValue(@Param('name') name: string) {
    return this.teamService.getTeamByName(name);
  }

  @Get()
  getTeams() {
    return this.teamService.getTeams();
  }
}
