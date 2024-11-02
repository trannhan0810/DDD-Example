import type { CryptoService } from '@application/third-party-service/cryto';
import { DomainError } from '@domain/base/base.error';
import type { UserRepository } from '@domain/user-management/user/user.repository';
import type { UserSpecificationFactory } from '@domain/user-management/user/user.specification';

export type VerifyResetPasswordInput = {
  email: string;
  password: string;
  resetCode: string;
};

export class ResetPasswordUseCase {
  constructor(
    private readonly userSpecFactory: UserSpecificationFactory,
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async process(input: VerifyResetPasswordInput): Promise<void> {
    const isEmailMatchedSpec = this.userSpecFactory.isEmailMatched(input.email);
    const isResetCodeMatchedSpec = this.userSpecFactory.isResetCodeMatched(input.resetCode);
    const isResetCodeExpiredSpec = this.userSpecFactory.isResetCodeExpired();

    const isValidResetCode = isResetCodeMatchedSpec.andNot(isResetCodeExpiredSpec);

    const user = await this.userRepository.findOneMatched(isEmailMatchedSpec);
    if (!user) throw new DomainError('User not found!');
    if (!isValidResetCode.isSastifyBy(user)) throw new DomainError('Reset code is incorrect or exprired!');

    user.hashedPassword = this.cryptoService.hash(input.password);
    return void (await this.userRepository.save(user));
  }
}
