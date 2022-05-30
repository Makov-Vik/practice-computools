import { UnauthorizedException } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ROLE } from 'src/constants';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway {
  public socketIdMap: any = {};

  constructor(private jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: any) {
    const payload = socket.handshake.headers.authorization;
    const bearer = payload.split(' ')[0].toLowerCase();
    const token = payload.split(' ')[1];

    if (bearer !== 'bearer' || !token) {
      throw new UnauthorizedException({ message: 'user is not authorized' });
    }
    let user;
    try {
      user = this.jwtService.verify(token);
    }
    catch(e) {
      console.log('failed verify token');
      socket.disconnect();
    }
    
    if(user.roleId === ROLE.ADMIN) {
      this.socketIdMap['admin'] = socket.id
    }
    else if (user.roleId === ROLE.MANAGER) {
      this.socketIdMap[`manager${user.id}`] = socket.id;
    }
    else {
      this.socketIdMap[`player${user.id}`] = socket.id;
    };

    console.log('id:', socket.id);
    socket.emit('connection', 'Successfully connected to server');      
    
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
