import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  HasOne,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { PRIMARY_KEY, RequestStatus } from '../constants';
import * as RequestStatusModel from './requestStatus.model';
import { RequestType } from './requestType.model';

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
  @Column({ type: DataType.INTEGER, allowNull: false })
  from: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  to: number;

  @Column({ type: DataType.INTEGER, defaultValue: RequestStatus.PENDING})
  status: number;

  @Column({ type: DataType.INTEGER })
  type: number;

  @Column({ type: DataType.STRING })
  description: string;

  @HasOne(() => RequestStatusModel.RequestStatus)
  requestStatus: RequestStatusModel.RequestStatus[]

  @HasOne(() => RequestType)
  requestType: RequestType[]
}
