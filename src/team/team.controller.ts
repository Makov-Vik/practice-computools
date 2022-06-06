import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { Role } from '../auth/checkRole.decorator';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { ROLE } from '../constants';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Role(ROLE[ROLE.MANAGER])
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTeamDto, @Req() req: Request) {
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
