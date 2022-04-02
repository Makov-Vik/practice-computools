import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { Role } from 'src/role/role.model';
import { Team } from 'src/team/team.model';
import { UserTeam } from 'src/team/user-team.model';

interface UserCreate {
  name: string;
  email: string;
  password: string;
}

@Table({ tableName: 'user', timestamps: false })
export class User extends Model<User, UserCreate> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, /*unique: true,*/ allowNull: false })
  email: string;

  @Column({ type: DataType.STRING })
  pathPhoto: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ForeignKey(() => Role)
  //@Column({ type: DataType.INTEGER })
  roleId: number;

  @BelongsToMany(() => Team, () => UserTeam)
  teams: Team[];
}
