import { UnauthorizedException } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
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
      console.log('user disconnected')
    }
    
    if(!user) {
      socket.disconnect();
    }
    else {

      console.log('id:', socket.id);
      socket.emit('connection', 'Successfully connected to server');      
    }
  }

  @SubscribeMessage('forAdmin')
  async forAdmin(socket: Socket, @MessageBody() data: any): Promise<boolean> {
    socket.emit('connection', data);

    console.log('from event forAdmin', 'data:', data);
    return true;
  }

  @SubscribeMessage('connection')
  findAll(client: Socket, @MessageBody() data: any): boolean {
    client.emit('connection', data)
    console.log('from event gateway ', 'data:', data);
    return true;
  }

}
