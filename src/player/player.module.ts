import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlayerController } from './player.controller';
import { Player } from './player.model';
import { PlayerService } from './player.service';

@Module({
  controllers: [PlayerController],
  providers: [PlayerService],
  imports: [SequelizeModule.forFeature([Player])],
})
export class PlayerModule {}
