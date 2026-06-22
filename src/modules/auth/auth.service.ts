import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(): { message: string } {
    return { message: 'Hello from login service' };
  }
}
