import { DomainError } from '@domain/base/base.error';
import { UserEmailMatchedSpec, UserEmailVerifiedSpec } from '@domain/user-management/user/user.specification';

import type { IEmailService, IEmailTemplate } from '@application/services/email';
import type { UserRepository } from '@domain/user-management/user/user.repository';

export type ResetPasswordInput = {
  email: string;
};

type ResetPasswordEmailContent = {
  code: string;
  email: string;
  resetPasswordUrl: string;
};

const resetPasswordEmailTemplate: IEmailTemplate<ResetPasswordEmailContent> = {
  subject: 'Reset Password',
  htmlContent(data) {
    return `
      <h1>Reset Password</h1>
      <p>Code: ${data.code}</p>
      <p>Email: ${data.email}</p>
      <p>Reset Password Url: ${data.resetPasswordUrl}</p>
    `;
  },
  textContent(data) {
    return `
      Reset Password
      Code: ${data.code}
      Email: ${data.email}
      Reset Password Url: ${data.resetPasswordUrl}
    `;
  },
};

export class ResetPasswordUseCase {
  constructor(private readonly userRepository: UserRepository, private readonly emailService: IEmailService) {}

  async process(input: ResetPasswordInput): Promise<void> {
    const isEmailMatchedSpec = new UserEmailMatchedSpec(input.email);
    const isEmailVerifiedSpec = new UserEmailVerifiedSpec();

    const user = await this.userRepository.findOneMatched(isEmailMatchedSpec);
    if (!user) throw new DomainError('User not found!');
    if (!isEmailVerifiedSpec.isSastifyBy(user)) throw new DomainError('Email is not verified!');

    user.resetPasswordCode = this.generateResetCode();
    user.resetPasswordCodeExpireTime = new Date();
    await this.userRepository.save(user);

    return void this.emailService.sendMail({
      from: 'Hh4r4@example.com',
      to: input.email,
      template: resetPasswordEmailTemplate,
      data: {
        code: user.resetPasswordCode,
        email: input.email,
        resetPasswordUrl: 'http://localhost:3000/reset-password',
      },
    });
  }

  private generateResetCode() {
    return '123456';
  }
}
