import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  //WsResponse,
} from '@nestjs/websockets';
//import { from, Observable } from 'rxjs';
//import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    client.emit('connection', 'Successfully connected to server');
  }

  // @SubscribeMessage('requestJoinTeam')
  // findAll(@MessageBody() data: any): boolean {
  //   console.log('from requestJoinTeam ', 'data:', data);
  //   return true;
  // }

  // @SubscribeMessage('requestLeaveTeam')
  // async identity(@MessageBody() data: number): Promise<number> {
  //   console.log('from requestLeaveTeam');
  //   return data;
  // }
}