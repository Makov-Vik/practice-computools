import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';
import { UserTeam } from './user-team.model';

interface TeamCreate {
  team: string;
  description: string;
}

@Table({ tableName: 'team', timestamps: false })
export class Team extends Model<Team, TeamCreate> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  description: string;

  @BelongsToMany(() => User, () => UserTeam)
  users: User[];
}
