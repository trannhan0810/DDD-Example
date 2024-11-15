import { DomainError } from '@domain/base/base.error';
import { ResetCodeValidSpec, UserEmailMatchedSpec } from '@domain/user-management/user/user.specification';

import type { ICryptoService } from '@application/services/cryto';
import type { UserRepository } from '@domain/user-management/user/user.repository';

export type VerifyResetPasswordInput = {
  email: string;
  password: string;
  resetCode: string;
};

export class ResetPasswordUseCase {
  constructor(private readonly userRepository: UserRepository, private readonly cryptoService: ICryptoService) {}

  async process(input: VerifyResetPasswordInput): Promise<void> {
    const isEmailMatchedSpec = new UserEmailMatchedSpec(input.email);
    const isResetCodeValidSpec = new ResetCodeValidSpec(input.resetCode);

    const user = await this.userRepository.findOneMatched(isEmailMatchedSpec);
    if (!user) throw new DomainError('User not found!');
    if (!isResetCodeValidSpec.isSastifyBy(user)) throw new DomainError('Reset code is incorrect or exprired!');

    user.hashedPassword = this.cryptoService.hash(input.password);
    return void (await this.userRepository.save(user));
  }
}
