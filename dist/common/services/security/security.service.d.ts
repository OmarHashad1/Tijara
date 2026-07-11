import { ConfigService } from '@nestjs/config';
export declare class SecurityService {
    private readonly configService;
    constructor(configService: ConfigService);
    encrypt(text: string): string;
    decrypt(payload: string): string;
    hash(text: string | Buffer): Promise<string>;
    verify(digest: string, password: string | Buffer): Promise<boolean>;
}
