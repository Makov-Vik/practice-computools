import { Model, Table, Column, DataType } from 'sequelize-typescript';

interface PlayerCreate {
  name: string;
  team: number;
}

@Table({ tableName: 'player', timestamps: false })
export class Player extends Model<Player, PlayerCreate> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER, unique: true })
  team: number;
}
