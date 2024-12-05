import { ResetPasswordInput } from '@application/dtos/auth/reset-password.dto';
import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { IEmailService } from '@application/services/common/email/email';
import { getSendResetPasswordEmailParams } from '@application/services/common/email/templates/reset-password';
import { DomainError } from '@domain/base/base.error';
import { UserRepository } from '@domain/user-management/user/user.repository';
import { UserEmailMatchedSpec, UserEmailVerifiedSpec } from '@domain/user-management/user/user.specification';

export class ResetPasswordUseCase {
  constructor(private readonly userRepository: UserRepository, private readonly emailService: IEmailService) {}

  async process(input: ResetPasswordInput): Promise<BaseMessageResponse> {
    const isEmailMatchedSpec = new UserEmailMatchedSpec(input.email);
    const isEmailVerifiedSpec = new UserEmailVerifiedSpec();

    const user = await this.userRepository.findOneMatched(isEmailMatchedSpec);
    if (!user) throw new DomainError('User not found!');
    if (!isEmailVerifiedSpec.isSastifyBy(user)) throw new DomainError('Email is not verified!');

    user.resetPasswordCode = this.generateResetCode();
    user.resetPasswordCodeExpireTime = new Date();
    await this.userRepository.save(user);

    await this.emailService.sendMail(
      getSendResetPasswordEmailParams({
        code: user.resetPasswordCode,
        email: user.email,
      }),
    );

    return { message: 'Reset password code send!' };
  }

  private generateResetCode() {
    return '123456';
  }
}
