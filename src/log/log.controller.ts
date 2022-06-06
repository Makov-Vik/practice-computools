import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../auth/checkRole.decorator';
import { LogDto } from './dto/log.dto';
import { LogInterface } from './log.interface';
import { LogService } from './log.service';
import { ROLE } from '../constants';


@Controller('log')
@Role(ROLE[ROLE.ADMIN])
@UseGuards(JwtAuthGuard)
export class LogController {
  constructor(private logService: LogService) {}

  @Post()
  async createLog(@Body() input: LogDto) {
    return await this.logService.create(input);
  }

  @Get()
  async getAll() {
    return await this.logService.findAll();
  }

  @Get('type')
  async getOneType(@Query('type') type: number) {
    return await this.logService.findOneType(type);
  }

  @Delete('one')
  async deleteOne(@Body() input: LogInterface) {
    const team = await this.logService.deleteOne(input.id);
    return team;
  }
}
