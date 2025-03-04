import { ForgotPasswordInput } from '@application/dtos/auth/forgot-password.dto';
import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { IEmailService } from '@application/services/common/email/email';
import { getSendResetPasswordEmailParams } from '@application/services/common/email/templates/reset-password';
import { DomainError } from '@domain/base/base.error';
import { User } from '@domain/user-management/entities/user.entity';
import { UserRepository } from '@domain/user-management/user/user.repository';

export class ForgotPasswordUseCase {
  constructor(private readonly userRepository: UserRepository, private readonly emailService: IEmailService) {}

  async process(input: ForgotPasswordInput): Promise<BaseMessageResponse> {
    const user = await this.userRepository.findOneMatched({
      email: { isIn: [input.email] },
    });
    if (!user) throw new DomainError('User not found!');
    if (!user.isEmailVerified) throw new DomainError('Email is not verified!');

    const { code } = user.updateResetPasswordCode();
    await this.userRepository.save(user);
    await this.sendEmailResetPassword(user, code);

    return new BaseMessageResponse('Reset password code send!');
  }

  async sendEmailResetPassword(user: User, code: string) {
    const template = getSendResetPasswordEmailParams({ code, email: user.email });
    await this.emailService.sendMail(template);
  }
}
