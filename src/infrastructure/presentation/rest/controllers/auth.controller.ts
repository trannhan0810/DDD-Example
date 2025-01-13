import { GetMeResponse } from '@application/dtos/auth/get-me.dto';
import { LoginInput, LoginResponse } from '@application/dtos/auth/login.dto';
import { ResetPasswordInput } from '@application/dtos/auth/reset-password.dto';
import { VerifyResetPasswordInput } from '@application/dtos/auth/verify-reset-password';
import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { GetMeUseCase } from '@application/use-cases/auth/get-me.use-case';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { ResetPasswordUseCase } from '@application/use-cases/auth/reset-password';
import { VerifyResetPasswordUseCase } from '@application/use-cases/auth/verify-reset-password';
import { Body, Controller, Get, Module, Post } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly verifyResetPasswordUseCase: VerifyResetPasswordUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @Post('login')
  @ApiBody({ type: LoginInput })
  @ApiResponse({ type: LoginResponse })
  async login(@Body('input') input: LoginInput): Promise<LoginResponse> {
    return this.loginUseCase.process(input);
  }

  @Post('reset-password')
  @ApiBody({ type: ResetPasswordInput })
  @ApiResponse({ type: BaseMessageResponse })
  async resetPassword(@Body('input') input: ResetPasswordInput): Promise<BaseMessageResponse> {
    return this.resetPasswordUseCase.process(input);
  }

  @Post('verify-reset-password')
  @ApiBody({ type: VerifyResetPasswordInput })
  @ApiResponse({ type: BaseMessageResponse })
  async verifyResetPassword(@Body('input') input: VerifyResetPasswordInput): Promise<BaseMessageResponse> {
    return this.verifyResetPasswordUseCase.process(input);
  }

  @Get('me')
  @ApiResponse({ type: GetMeResponse })
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
