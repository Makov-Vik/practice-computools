import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './player.model';

@Injectable()
export class PlayerService {
  constructor(@InjectModel(Player) private playerRepository: typeof Player) {}

  async createPlayer(dto: CreatePlayerDto) {
    const player = await this.playerRepository.create(dto);
    return player;
  }
}
