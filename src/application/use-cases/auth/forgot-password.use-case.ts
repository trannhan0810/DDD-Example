import { IEmailService } from '@application/common/email/email';
import { getSendResetPasswordEmailParams } from '@application/common/email/templates/reset-password';
import { ForgotPasswordInput } from '@application/dtos/auth/forgot-password.dto';
import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { DomainError } from '@domain/base/base.error';
import { User } from '@domain/user-management/entities/user.entity';
import { UserRepository } from '@domain/user-management/respositories/user.repository';

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
