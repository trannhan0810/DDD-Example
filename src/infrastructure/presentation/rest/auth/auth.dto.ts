import { GetMeResponse } from '@application/use-cases/auth/get-me';
import { LoginInput, LoginResponse } from '@application/use-cases/auth/login';
import { ResetPasswordInput } from '@application/use-cases/auth/reset-password';
import { VerifyResetPasswordInput } from '@application/use-cases/auth/verify-reset-password';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginInputDto implements LoginInput {
  @IsEmail()
  @ApiProperty()
  email!: string;

  @IsNotEmpty()
  @ApiProperty()
  password!: string;
}

export class LoginResponseDto implements LoginResponse {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;
}

export class ResetPasswordInputDto implements ResetPasswordInput {
  @IsEmail()
  @ApiProperty()
  email!: string;
}

export class VerifyResetPasswordInputDto implements VerifyResetPasswordInput {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  password!: string;

  @ApiProperty()
  resetCode!: string;
}

export class GetMeResponseDto implements GetMeResponse {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  roles!: string[];
}
