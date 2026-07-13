import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (!(exception instanceof HttpException)) {
      super.catch(exception, host);
      return;
    }

    const client = host.switchToWs().getClient();
    const status = exception.getStatus();
    const response = exception.getResponse();
    const message =
      typeof response === 'string' ? response : (response as any).message;

    client.emit('exception', { status, message });
  }
}
