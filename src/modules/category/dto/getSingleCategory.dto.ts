import { IsNotEmpty, IsString } from 'class-validator';

export class getSingleCategory {
  @IsString()
  @IsNotEmpty()
  slug!: string;
}
