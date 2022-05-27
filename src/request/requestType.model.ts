import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { PRIMARY_KEY } from '../constants';
import { Request } from './request.model';

@Table({ tableName: 'requestType' })
export class RequestType extends Model<RequestType> {
  @Column(PRIMARY_KEY)
  id: number;

  @ForeignKey(() => Request)
  @Column({ type: DataType.STRING })
  type: string;
}
