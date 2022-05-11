import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { UserTeam } from './user-team.model';
import { PRIMARY_KEY } from '../constants';

interface TeamCreate {
  name: string;
  description: string;
  headManager?: number;
}

@Table({ tableName: 'team' })
export class Team extends Model<Team, TeamCreate> {
  @Column(PRIMARY_KEY)
  id: number;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column
  headManager: number;

  @BelongsToMany(() => User, () => UserTeam)
  users: User[];
}
