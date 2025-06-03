import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsLowercase, IsNumberString } from 'class-validator';

export class BasePersonDto {
  @Expose()
  @IsNumberString()
  @ApiProperty({ type: String })
  id!: string | number;

  @Expose()
  @ApiProperty()
  firstname!: string;

  @Expose()
  @ApiProperty()
  lastname!: string;

  @Expose()
  @IsEmail()
  @IsLowercase()
  @ApiProperty()
  email!: string;

  @Expose()
  @ApiProperty()
  isEmailVerified!: boolean;
}
