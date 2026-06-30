import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/decorators/role.decorator';
import { Token } from 'src/common/decorators/token.decorator';
import { ROLE } from 'src/common/enums';
import { TOKEN_TYPE } from 'src/common/enums/auth.enum';
import { AuthenticationGuard } from '../guards/auth/authentication.guard';
import { AuthorizationGuard } from '../guards/auth/authorization.guard';

export const Auth = (
  roles: ROLE[],
  tokenTypeVal: TOKEN_TYPE = TOKEN_TYPE.ACCESS,
) => {
  return applyDecorators(
    Token(tokenTypeVal),
    Role(roles),
    UseGuards(AuthenticationGuard, AuthorizationGuard),
  );
};
