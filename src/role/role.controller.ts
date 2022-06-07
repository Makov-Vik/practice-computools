import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { ROLE } from '../constants';
import { Role } from '../auth/checkRole.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('role')
@Role(ROLE[ROLE.ADMIN])
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  getRoleByValue(@Body() dto: CreateRoleDto) {
    return this.roleService.getRoleByValue(dto.role);
  }

  @Get('/all')
  getAll() {
    return this.roleService.getAllRoles();
  }
}
