import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LogType } from 'src/constants';
import { LogService } from 'src/log/log.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.model';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role, private logService: LogService) {}

  
  async createRole(dto: CreateRoleDto) {
    try {
      const role = await this.roleRepository.create(dto);

      // log to mongo
      const log = {
        message: `new role created: ${role.role}`,
        where: 'role.servise.ts (createRole())',
        type: LogType[LogType.create]
      }
      this.logService.create(log); 
      return role;
    } catch(e) {
      // log to mongo
      const log = {
        message: `faild write into db ${e}`,
        where: 'role.servise.ts (createRole())',
        type: LogType[LogType.error]
        }
      this.logService.create(log); 
    }
    
  }

  async getRoleByValue(roleInput: string) {
    const role = await this.roleRepository.findOne({
      where: { role: roleInput },
    });
    return role;
  }
}
