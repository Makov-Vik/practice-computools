import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/checkRole.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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
}
