import {
  Model,
  Table,
  Column,
  DataType,
} from 'sequelize-typescript';
import { PRIMARY_KEY } from '../constants';

@Table({ tableName: 'notification' })
export class Notification extends Model<Notification> {
  @Column(PRIMARY_KEY)
  id: number;

  @Column({ type: DataType.NUMBER })
  from: number;

  @Column({ type: DataType.NUMBER })
  to: number;

  @Column({ type: DataType.STRING })
  status: string;

  @Column({ type: DataType.STRING })
  type: string;
}
