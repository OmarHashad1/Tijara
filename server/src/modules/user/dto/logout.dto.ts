import { IsEnum, IsNotEmpty } from 'class-validator';
import { LOGOUT_TYPE } from 'src/common/types';

export class LogoutDto {
  @IsEnum(LOGOUT_TYPE)
  @IsNotEmpty()
  type!: LOGOUT_TYPE;
}
