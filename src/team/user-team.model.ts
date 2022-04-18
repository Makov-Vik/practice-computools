import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';
import { Team } from './team.model';
import { PRIMARY_KEY } from 'src/constants';

@Table({ tableName: 'user-team' })
export class UserTeam extends Model<UserTeam> {
  @Column(PRIMARY_KEY)
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ForeignKey(() => Team)
  @Column({ type: DataType.INTEGER })
  teamId: number;
}
