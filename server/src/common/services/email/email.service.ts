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

    emailEmitter.on(
      EMAIL_EVENTS.ORDER_CONFIRMED,
      async ({ to, firstName, orderId, total }) => {
        await this.sendMail(to, 'Your order has been confirmed', {
          html: `<p>Hi ${firstName}, your order <b>#${orderId}</b> has been confirmed. Total: <b>${total}</b>.</p>`,
        });
      },
    );

    emailEmitter.on(
      EMAIL_EVENTS.ORDER_CANCELLED,
      async ({ to, firstName, orderId }) => {
        await this.sendMail(to, 'Your order has been cancelled', {
          html: `<p>Hi ${firstName}, your order <b>#${orderId}</b> has been cancelled.</p>`,
        });
      },
    );

    emailEmitter.on(
      EMAIL_EVENTS.ORDER_REFUNDED,
      async ({ to, firstName, orderId, amount }) => {
        await this.sendMail(to, 'Your order has been refunded', {
          html: `<p>Hi ${firstName}, your order <b>#${orderId}</b> was cancelled and <b>${amount}</b> has been refunded to your original payment method.</p>`,
        });
      },
    );

    emailEmitter.on(
      EMAIL_EVENTS.ORDER_STATUS_UPDATED,
      async ({ to, firstName, orderId, status }) => {
        await this.sendMail(to, 'Your order status has been updated', {
          html: `<p>Hi ${firstName}, your order <b>#${orderId}</b> is now <b>${status}</b>.</p>`,
        });
      },
    );

    emailEmitter.on(
      EMAIL_EVENTS.USER_BANNED,
      async ({ to, firstName, reason }) => {
        await this.sendMail(to, 'Your account has been suspended', {
          html: `<p>Hi ${firstName}, your account has been suspended. Reason: <b>${reason}</b>.</p>`,
        });
      },
    );

    emailEmitter.on(
      EMAIL_EVENTS.USER_UNBANNED,
      async ({ to, firstName }) => {
        await this.sendMail(to, 'Your account has been reinstated', {
          html: `<p>Hi ${firstName}, your account has been reinstated and is now active again.</p>`,
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