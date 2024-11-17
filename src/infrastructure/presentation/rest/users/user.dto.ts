import { CreateUserInput } from '@application/use-cases/user/create-user';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto implements CreateUserInput {
  @IsNotEmpty()
  @ApiProperty()
  firstname!: string;

  @IsNotEmpty()
  @ApiProperty()
  lastname!: string;

  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty()
  email!: string;

  @IsNotEmpty()
  @ApiProperty()
  password!: string;
}
