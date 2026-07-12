import {
  Ack,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server!: Server;

  afterInit() {
    console.log('Gateway is running');
  }

  handleConnection(client: Socket) {
    console.log(`Socket connected::${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Socket disconnect::${client.id}`);
  }
}
