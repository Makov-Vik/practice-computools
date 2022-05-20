import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '../auth/checkRole.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  getRoleByValue(@Body() dto: CreateRoleDto) {
    return this.roleService.getRoleByValue(dto.role);
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  getAll(@Body() dto: CreateRoleDto) {
    return this.roleService.getAllRoles();
  }
}
