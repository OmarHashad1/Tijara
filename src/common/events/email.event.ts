import { EventEmitter } from 'stream';
import { EmailService } from '../services/email';
import { ConfigService } from '@nestjs/config';
import { EMAIL_EVENTS } from '../enums/email.enums';

export interface EMAIL_EVENTS_PAYLOAD {
  [EMAIL_EVENTS.FORGOT_PASSWORD]: {
    to: string;
    firstName: string;
    otp: string;
  };
  [EMAIL_EVENTS.VERIFY_EMAIL]: {
    to: string;
    firstName: string;
    otp: string;
  };
}

class EmailEmitter extends EventEmitter {
  override emit<K extends keyof EMAIL_EVENTS_PAYLOAD>(
    event: K,
    payload: EMAIL_EVENTS_PAYLOAD[K],
  ): boolean {
    return super.emit(event, payload);
  }

  override on<K extends keyof EMAIL_EVENTS_PAYLOAD>(
    event: K,
    listner: (args: EMAIL_EVENTS_PAYLOAD[K]) => void,
  ): this {
    return super.on(event, listner);
  }
}

export const emailEmitter = new EmailEmitter();
