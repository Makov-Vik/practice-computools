import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Post()
  create(@Body() dto: CreateTeamDto) {
    return this.teamService.createTeam(dto);
  }

  @Get('/:name')
  getByValue(@Param('name') name: string) {
    return this.teamService.getTeamByName(name);
  }
}
