import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './role.model';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async getRoleByValue(roleInput: string) {
    const role = await this.roleRepository.findOne({
      where: { role: roleInput },
    });
    return role;
  }

  async getAllRoles() {
    return await this.roleRepository.findAll()
  }
}
