import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { Role } from '../role/role.model';
import { Team } from '../team/team.model';
import { UserTeam } from '../team/user-team.model';
import { PRIMARY_KEY } from '../constants';

interface UserCreate {
  name: string;
  email: string;
  password: string;
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

  @BelongsToMany(() => Team, () => UserTeam)
  teams: Team[];
}
