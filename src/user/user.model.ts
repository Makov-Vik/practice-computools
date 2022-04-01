import { Model, Table, Column, DataType } from 'sequelize-typescript';

interface UserCreate {
  name: string;
  team: number;
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

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING })
  pathPhoto: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
}
