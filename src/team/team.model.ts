import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';
import { UserTeam } from './user-team.model';
import { PRIMARY_KEY } from 'src/constants';

interface TeamCreate {
  team: string;
  description: string;
}

@Table({ tableName: 'team' })
export class Team extends Model<Team, TeamCreate> {
  @Column(PRIMARY_KEY)
  id: number;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  description: string;

  @BelongsToMany(() => User, () => UserTeam)
  users: User[];
}
