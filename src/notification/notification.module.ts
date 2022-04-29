import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './notification.model';

@Module({
  imports: [SequelizeModule.forFeature([Notification])]
})
export class NotificationModule {}
