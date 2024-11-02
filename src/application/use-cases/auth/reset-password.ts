import type { EmailService } from '@application/third-party-service/email';
import { DomainError } from '@domain/base/base.error';
import type { UserRepository } from '@domain/user-management/user/user.repository';
import type { UserSpecificationFactory } from '@domain/user-management/user/user.specification';

export type ResetPasswordInput = {
  email: string;
};

export class ResetPasswordUseCase {
  constructor(
    private readonly userSpecFactory: UserSpecificationFactory,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async process(input: ResetPasswordInput): Promise<void> {
    const isEmailMatchedSpec = this.userSpecFactory.isEmailMatched(input.email);
    const isEmailVerifiedSpec = this.userSpecFactory.isEmailVerified();

    const user = await this.userRepository.findOneMatched(isEmailMatchedSpec);
    if (!user) throw new DomainError('User not found!');
    if (!isEmailVerifiedSpec.isSastifyBy(user)) throw new DomainError('Email is not verified!');

    user.resetPasswordCode = this.generateResetCode();
    user.resetPasswordCodeExpireTime = new Date();
    await this.userRepository.save(user);

    return void this.emailService.sendMail(input.email, user);
  }

  private generateResetCode() {
    return '123456';
  }
}
