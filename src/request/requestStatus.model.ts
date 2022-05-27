import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { PRIMARY_KEY } from '../constants';
import { Request } from './request.model';

@Table({ tableName: 'requestStatus' })
export class RequestStatus extends Model<RequestStatus> {
  @Column(PRIMARY_KEY)
  id: number;

  @ForeignKey(() => Request)
  @Column({ type: DataType.STRING })
  status: string;

}
