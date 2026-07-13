import {
  BadGatewayException,
  BadRequestException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { WsExceptionFilter } from 'src/common/filters/ws-exception.filter';
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
import { AuthenticationGuard } from 'src/common/guards/auth';
import { RedisService } from 'src/common/services/redis';
import { TOKEN_TYPE } from 'src/common/enums/auth.enum';
import { AuthSocket } from 'src/common/types';
import { getToken } from 'src/common/utils/socket.util';
import { CLIENT_URL } from 'src/configs';
import { Auth } from 'src/common/decorators';
import { ROLE } from 'src/common/enums';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
})
@UseFilters(WsExceptionFilter)
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly authGuard: AuthenticationGuard,
    private readonly redisService: RedisService,
  ) {}
  @WebSocketServer()
  server!: Server;

  afterInit() {
    console.log('Gateway is running');
  }

  async handleConnection(client: AuthSocket) {
    try {
      client.credentials = await this.authGuard.validateToken(
        getToken(client),
        TOKEN_TYPE.ACCESS,
      );
      await this.redisService.addSocketConn(
        client.id,
        client.credentials.decoded._id,
      );
    } catch (err: any) {
      console.log(err);
      client.emit(
        'custom_error',
        err.message ?? 'Forbidden: invalid or expired token',
      );
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: AuthSocket) {
    try {
      if (!client.credentials) return;

      const userId = client.credentials.decoded._id;
      await this.redisService.removeSocketConn(client.id, userId);
      const remaining = await this.redisService.socketConnCount(userId);
      if (remaining < 1) this.server.emit('user_offline', { userId });
    } catch (err: any) {
      client.emit('custom_error', err.message ?? 'Unexpected error occured');
    }
  }

  @Auth([ROLE.ADMIN])
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    try {
      client.emit('events', 'hello');
    } catch (err: any) {
      console.log(err);
      client.emit('custom_error', err.message ?? 'error');
      throw new BadGatewayException(err.message);
    }
  }
}
