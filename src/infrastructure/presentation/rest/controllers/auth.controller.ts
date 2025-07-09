import { CurrentUser, PublicAPI, UserCtx } from '../guards/auth.guard';

import { ForgotPasswordInput } from '@application/dtos/auth/forgot-password.dto';
import { GetMeResponse } from '@application/dtos/auth/get-me.dto';
import { LoginInput, LoginResponse } from '@application/dtos/auth/login.dto';
import { ResetPasswordInput } from '@application/dtos/auth/reset-password.dto';
import { BaseMessageResponse } from '@application/dtos/shared/message-response.dto';
import { ForgotPasswordUseCase } from '@application/use-cases/auth/forgot-password.use-case';
import { GetMeUseCase } from '@application/use-cases/auth/get-me.use-case';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { ResetPasswordUseCase } from '@application/use-cases/auth/reset-password.use-case';
import { GetAPI } from 'src/shared/decorators/api';

import { Body, Controller, Module, Post } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly resetPasswordUseCase: ForgotPasswordUseCase,
    private readonly verifyResetPasswordUseCase: ResetPasswordUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @PublicAPI()
  @Post('login')
  @ApiBody({ type: LoginInput })
  @ApiResponse({ type: LoginResponse })
  async login(@Body() input: LoginInput): Promise<LoginResponse> {
    return this.loginUseCase.process(input);
  }

  @Post('forgot-password')
  @ApiBody({ type: ForgotPasswordInput })
  @ApiResponse({ type: BaseMessageResponse })
  async resetPassword(@Body() input: ForgotPasswordInput): Promise<BaseMessageResponse> {
    return this.resetPasswordUseCase.process(input);
  }

  @Post('reset-password')
  @ApiBody({ type: ResetPasswordInput })
  @ApiResponse({ type: BaseMessageResponse })
  async verifyResetPassword(@Body() input: ResetPasswordInput): Promise<BaseMessageResponse> {
    return this.verifyResetPasswordUseCase.process(input);
  }

  @GetAPI('/me', { res: GetMeResponse })
  async getMe(@UserCtx() currentUser: CurrentUser): Promise<GetMeResponse> {
    return this.getMeUseCase.process({ id: currentUser.id });
  }
}

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [LoginUseCase, ForgotPasswordUseCase, ResetPasswordUseCase, GetMeUseCase],
})
export class AuthRestApiModule {}
