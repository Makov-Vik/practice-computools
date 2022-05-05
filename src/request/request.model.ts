import {
  Model,
  Table,
  Column,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';
import { PRIMARY_KEY, RequestStatus } from '../constants';
interface CreateRequest {
  readonly from: number;
  readonly to: number;
  readonly status?: number;
  readonly type: number;
  readonly description: string;
}
@Table({ tableName: 'request' })
export class Request extends Model<Request, CreateRequest> {
  @Column(PRIMARY_KEY)
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.NUMBER })
  from: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.NUMBER })
  to: number;

  @Column({ type: DataType.NUMBER, defaultValue: RequestStatus.pending})
  status: number;

  @Column({ type: DataType.NUMBER })
  type: number;

  @Column({ type: DataType.STRING })
  description: string;
}
