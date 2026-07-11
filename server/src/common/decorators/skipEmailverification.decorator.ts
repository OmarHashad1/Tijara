export class SkipEmailVerificationDecorator {}
import { SetMetadata } from '@nestjs/common';

export const skipEmailVerificationName = 'skipEmailVerification';
export const SkipEmailVerification = () => {
  return SetMetadata(skipEmailVerificationName, true);
};
