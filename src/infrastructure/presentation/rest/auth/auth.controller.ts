import { LoginInputDto, LoginResponseDto, ResetPasswordInputDto, VerifyResetPasswordInputDto } from './auth.dto';

import { GetMeResponse, GetMeUseCase } from '@application/use-cases/auth/get-me';
import { LoginUseCase } from '@application/use-cases/auth/login';
import { ResetPasswordUseCase } from '@application/use-cases/auth/reset-password';
import { VerifyResetPasswordUseCase } from '@application/use-cases/auth/verify-reset-password';
import { Body, Controller, Get, Module, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

@Controller('')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly verifyResetPasswordUseCase: VerifyResetPasswordUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @ApiBody({ type: LoginInputDto })
  @Post('login')
  async login(@Body('input') input: LoginInputDto): Promise<LoginResponseDto> {
    return this.loginUseCase.process(input);
  }

  @ApiBody({ type: ResetPasswordInputDto })
  @Post('reset-password')
  async resetPassword(@Body('input') input: ResetPasswordInputDto): Promise<void> {
    return this.resetPasswordUseCase.process(input);
  }

  @ApiBody({ type: VerifyResetPasswordInputDto })
  @Post('verify-reset-password')
  async verifyResetPassword(@Body('input') input: VerifyResetPasswordInputDto): Promise<void> {
    return this.verifyResetPasswordUseCase.process(input);
  }

  @Get('me')
  async getMe(): Promise<GetMeResponse> {
    return this.getMeUseCase.process({ accessToken: '' });
  }
}

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [LoginUseCase, ResetPasswordUseCase, VerifyResetPasswordUseCase, GetMeUseCase],
})
export class AuthRestApiModule {}
