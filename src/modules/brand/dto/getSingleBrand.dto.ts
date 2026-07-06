import { IsNotEmpty, IsString } from 'class-validator';

export class getSingleBrand {
  @IsString()
  @IsNotEmpty()
  slug!: string;
}
