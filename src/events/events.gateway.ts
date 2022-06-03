import { UnauthorizedException } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { LogType, ROLE } from '../constants';
import { LogService } from '../log/log.service';

type SocketIdMap = {
  [key: string]: Socket['id']
};


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway {

  public socketIdMap: SocketIdMap = {};

  constructor(private jwtService: JwtService, private logService: LogService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: any) {
    const payload = socket.handshake.headers.authorization;
    const bearer = payload.split(' ')[0].toLowerCase();
    const token = payload.split(' ')[1];

    if (bearer !== 'bearer' || !token) {
      throw new UnauthorizedException({ message: 'user is not authorized' });
    }
    let user;
    let keyOfMap;
    try {
      user = this.jwtService.verify(token);

      switch (user.roleId) {
        case ROLE.ADMIN: {
          this.socketIdMap['admin'] = socket.id;
          keyOfMap = 'admin'
        }
        case ROLE.MANAGER: {
           this.socketIdMap[`manager${user.id}`] = socket.id;
           keyOfMap = `manager${user.id}`;
        }
        case ROLE.PLAYER: {
          this.socketIdMap[`player${user.id}`] = socket.id;
          keyOfMap = `player${user.id}`;
        }  

      }
      socket.emit('connection', 'Successfully connected to server');
    } catch(e) {
      // log to mongo
      const log = {
        message: `user failed connecting by socket`,
        where: 'events.gateway.ts (handleConnection())',
        type: LogType.ERROR
      }
      await this.logService.create(log);
      socket.disconnect();

      delete this.socketIdMap[`${keyOfMap}`];
      console.log(this.socketIdMap)
    }
  }

  forAdmin(data: any) {
    this.server.to(this.socketIdMap.admin).emit('forAdmin', data);
  };

  forManager(managerId: number, data: any) {
    this.server.to(this.socketIdMap[`manager${managerId}`]).emit('forManager', data);
  };

  forPlayer(playerId: number, data: any) {
    this.server.to(this.socketIdMap[`player${playerId}`]).emit('forPlayer', data);
  };

}
