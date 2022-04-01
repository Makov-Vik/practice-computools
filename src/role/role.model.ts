import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { User } from 'src/user/user.model';

interface RoleCreate {
  value: string;
  description: string;
}

@Table({ tableName: 'role', timestamps: false })
export class Role extends Model<Role, RoleCreate> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  value: string;

  @Column({ type: DataType.STRING })
  description: string;

  @HasMany(() => User)
  users: User[];
}
