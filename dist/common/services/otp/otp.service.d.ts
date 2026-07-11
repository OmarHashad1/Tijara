import { SecurityService } from '../security/security.service';
import { RedisService } from '../redis/redis.service';
import { Types } from 'mongoose';
import { EmailService } from '../email';
import { EMAIL_EVENTS } from "../../enums/email.enums";
export declare class OtpService {
    private readonly redisService;
    private readonly securityService;
    private readonly emailService;
    constructor(redisService: RedisService, securityService: SecurityService, emailService: EmailService);
    send(userId: Types.ObjectId, subject: EMAIL_EVENTS): Promise<string>;
    verify(userId: Types.ObjectId, subject: EMAIL_EVENTS, otp: string): Promise<boolean>;
    consume(userId: Types.ObjectId, subject: EMAIL_EVENTS): Promise<boolean>;
}
