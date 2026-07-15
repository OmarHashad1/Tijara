import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketIOAdapter extends IoAdapter {
  constructor(private readonly app: INestApplication) {
    super(app);
  }
  createIOServer(port: number, options?: any) {
    const configService = this.app.get(ConfigService);
    return super.createIOServer(port, {
      ...options,
      cors: { origin: configService.get('CLIENT_URL'), credentials: true },
    });
  }
}
