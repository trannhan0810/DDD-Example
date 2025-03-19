import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsLowercase, IsNumberString } from 'class-validator';

export class BasePersonDto {
  @IsNumberString()
  @ApiProperty({ type: String })
  id!: string | number;

  @ApiProperty()
  firstname!: string;

  @ApiProperty()
  lastname!: string;

  @IsEmail()
  @IsLowercase()
  @ApiProperty()
  email!: string;

  @ApiProperty()
  isEmailVerified!: boolean;
}
