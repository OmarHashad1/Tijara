import { SetMetadata } from '@nestjs/common';
import { TOKEN_TYPE } from 'src/common/enums/auth.enum';

export const personalCacheName = 'personalCache';
export const PersonalCache = (isPersonalCache = true) => {
  return SetMetadata(personalCacheName, isPersonalCache);
};
