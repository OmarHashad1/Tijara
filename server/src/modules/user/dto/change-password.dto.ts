import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { NotSameAs } from 'src/common/decorators/NotSame.decorator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword!: string;

  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
  @NotSameAs(['oldPassword'])
  newPassword!: string;
}
