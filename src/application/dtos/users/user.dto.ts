import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsLowercase, IsNumberString } from 'class-validator';

export class BaseUserDto {
  @IsNumberString()
  @ApiProperty({ type: () => String })
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

export class BaseUserResponse extends PickType(BaseUserDto, [
  'id',
  'email',
  'firstname',
  'lastname',
  'isEmailVerified',
]) {}
