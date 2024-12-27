import { ResetPasswordInput } from '@application/dtos/auth/reset-password.dto';
import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { IEmailService } from '@application/services/common/email/email';
import { getSendResetPasswordEmailParams } from '@application/services/common/email/templates/reset-password';
import { DomainError } from '@domain/base/base.error';
import { UserRepository } from '@domain/user-management/user/user.repository';

export class ResetPasswordUseCase {
  constructor(private readonly userRepository: UserRepository, private readonly emailService: IEmailService) {}

  async process(input: ResetPasswordInput): Promise<BaseMessageResponse> {
    const user = await this.userRepository.findOneMatched({
      email: { isIn: [input.email] },
    });
    if (!user) throw new DomainError('User not found!');
    if (!user.isEmailVerified) throw new DomainError('Email is not verified!');

    const { code } = user.updateResetPassword();
    await this.userRepository.save(user);
    await this.emailService.sendMail(getSendResetPasswordEmailParams({ code, email: user.email }));

    return new BaseMessageResponse('Reset password code send!');
  }

  private generateResetCode() {
    return '123456';
  }
}
