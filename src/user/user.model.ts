import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsToMany,
  BelongsTo,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { Role } from '../role/role.model';
import { Team } from '../team/team.model';
import { UserTeam } from '../team/user-team.model';
import { PRIMARY_KEY } from '../constants';
import { Request } from '../request/request.model';

interface UserCreate {
  name: string;
  email: string;
  password: string;
  ban: boolean;
  banReason: string;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserCreate> {
  @Column(PRIMARY_KEY)
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING })
  pathPhoto: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ForeignKey(() => Role)
  roleId: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  ban: boolean;

  @Column({ type: DataType.STRING })
  banReason: string;

  @BelongsToMany(() => Team, () => UserTeam)
  teams: Team[];

  @HasOne(() => Request)
  request: Request[]
  
}
