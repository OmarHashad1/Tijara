import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Transporter, createTransport } from 'nodemailer';
import { EMAIL_EVENTS } from 'src/common/enums/email.enums';
import { emailEmitter } from 'src/common/events/email.event';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      service: this.configService.get<string>('SMTP_SERVICE'),
      port: Number(this.configService.get<string>('SMTP_PORT')),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  onModuleInit() {
    emailEmitter.on(
      EMAIL_EVENTS.FORGOT_PASSWORD,
      async ({ to, firstName, otp }) => {
        await this.sendMail(to, 'Reset your password', {
          html: `<p>Hi ${firstName}, your OTP is <b>${otp}</b></p>`,
        });
      },
    );

    emailEmitter.on(
      EMAIL_EVENTS.VERIFY_EMAIL,
      async ({ to, firstName, otp }) => {
        await this.sendMail(to, 'Verify your email', {
          html: `<p>Hi ${firstName}, your code is <b>${otp}</b></p>`,
        });
      },
    );
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Server is ready to take our messages');
    } catch (err) {
      console.error('Verification failed:', err);
    }
  }

  async sendMail(
    to: string,
    subject: string,
    body: { text?: string; html?: string },
  ) {
    try {
      return await this.transporter.sendMail({
        to,
        subject,
        ...body,
      });
    } catch (err) {
      throw err;
    }
  }
}