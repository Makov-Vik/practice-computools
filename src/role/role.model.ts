import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { User } from '../user/user.model';
import { PRIMARY_KEY } from '../constants';

interface RoleCreate {
  role: string;
  description: string;
}

@Table({ tableName: 'role' })
export class Role extends Model<Role, RoleCreate> {
  @Column(PRIMARY_KEY)
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  role: string;

  @Column({ type: DataType.STRING })
  description: string;

  @HasMany(() => User)
  users: User[];
}
