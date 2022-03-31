import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  constructor(private playerServise: PlayerService) {}

  @Post()
  create(@Body() playerDto: CreatePlayerDto) {
    return this.playerServise.createPlayer(playerDto);
  }
}
