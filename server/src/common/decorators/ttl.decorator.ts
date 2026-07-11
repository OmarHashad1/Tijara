import { SetMetadata } from '@nestjs/common';

const ttlName = 'ttlVal';
export const TTL = (ttlValue: number) => {
  return SetMetadata(ttlName, ttlValue);
};
