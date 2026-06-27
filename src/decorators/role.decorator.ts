import { SetMetadata } from '@nestjs/common';
import { ROLE } from 'src/enums';

export const allowedRoleName = 'allowedRoles';
export const Role = (roles: ROLE[]) => {
  return SetMetadata(allowedRoleName, roles);
};
