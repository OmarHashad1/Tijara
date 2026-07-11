import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class EmailService implements OnModuleInit {
    private readonly configService;
    private readonly transporter;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    verifyConnection(): Promise<void>;
    sendMail(to: string, subject: string, body: {
        text?: string;
        html?: string;
    }): Promise<any>;
}
