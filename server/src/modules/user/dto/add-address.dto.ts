import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddAddressDto {
  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  country!: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
