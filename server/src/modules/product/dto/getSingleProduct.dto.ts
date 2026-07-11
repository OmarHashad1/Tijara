import { IsNotEmpty, IsString } from 'class-validator';

export class getSingleProduct {
  @IsString()
  @IsNotEmpty()
  slug!: string;
}
