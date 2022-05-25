// import {
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
//   //WsResponse,
// } from '@nestjs/websockets';
// //import { from, Observable } from 'rxjs';
// //import { map } from 'rxjs/operators';
// import { Server } from 'socket.io';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// export class EventsGateway {
//   @WebSocketServer()
//   server: Server;

//   handleConnection(client: any) {
//     client.emit('connection', 'Successfully connected to server');
//   }

//   @SubscribeMessage('events')
//   findAll(@MessageBody() data: any): boolean {
//     console.log('from events');
//     return true;
//   }

//   @SubscribeMessage('identity')
//   async identity(@MessageBody() data: number): Promise<number> {
//     console.log('from identity');
//     return data;
//   }
// }