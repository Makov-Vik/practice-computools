import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';
import { Team } from './team.model';

@Table({ tableName: 'user-team', timestamps: false })
export class UserTeam extends Model<UserTeam> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ForeignKey(() => Team)
  @Column({ type: DataType.INTEGER })
  teamId: number;
}
