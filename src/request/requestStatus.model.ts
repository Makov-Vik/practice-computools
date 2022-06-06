import {
  Model,
  Table,
  Column,
  DataType,
  HasOne,
} from 'sequelize-typescript';
import { PRIMARY_KEY } from '../constants';
import { Request } from './request.model';

@Table({ tableName: 'requestStatus' })
export class RequestStatus extends Model<RequestStatus> {
  @Column(PRIMARY_KEY)
  id: number;

  @Column({ type: DataType.STRING })
  status: string;

  @HasOne(() => Request)
  request: Request[]
}
