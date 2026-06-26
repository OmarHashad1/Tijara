import { SetMetadata } from '@nestjs/common';
import { TOKEN_TYPE } from 'src/enums/auth.enums';

export const tokenTypeName = 'tokenType';
export const Token = (tokenTtypeVal = TOKEN_TYPE.ACCESS) => {
  return SetMetadata(tokenTypeName,tokenTtypeVal)
};
