import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
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
