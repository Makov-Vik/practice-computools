import {
  Model,
  Table,
  Column,
  DataType,
} from 'sequelize-typescript';
import { PRIMARY_KEY } from '../constants';
interface CreateRequest {
  readonly from: number;
  readonly to: number;
  readonly status?: string;
  readonly type: string;
}
@Table({ tableName: 'request' })
export class Request extends Model<Request, CreateRequest> {
  @Column(PRIMARY_KEY)
  id: number;

  @Column({ type: DataType.NUMBER })
  from: number;

  @Column({ type: DataType.NUMBER })
  to: number;

  @Column({ type: DataType.STRING, defaultValue: 'decline'})
  status: string;

  @Column({ type: DataType.STRING })
  type: string;

  @Column({ type: DataType.STRING })
  description: string;
}
