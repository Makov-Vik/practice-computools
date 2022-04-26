import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogDto } from './dto/log.dto';
import { LogInterface } from './log.interface';
import { Log } from './log.model';

@Injectable()
export class LogService {
  constructor(@InjectModel('Log') private logModel: Model<Log>) {}

  async create(log: LogDto) {
    try {
      return await this.logModel.create(log);

    } catch (e) {
      console.log(e);
    }
  };

  async findAll () {
    return await this.logModel.find().sort({ $natural: -1 }).limit(20).lean();
  };

  async findOneType (type: number) {
    return await this.logModel.find({type: type});
  }

  async deleteOne(id: string) {
    return await this.logModel.deleteOne({ _id: id });
  }

}
