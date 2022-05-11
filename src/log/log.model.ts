import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {

  @Prop()
  message: String;

  @Prop()
  where: string;

  @Prop()
  type: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);