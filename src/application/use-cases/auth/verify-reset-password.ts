import { VerifyResetPasswordInput } from '@application/dtos/auth/verify-reset-password';
import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { ICryptoService } from '@application/services/common/cryto';
import { DomainError } from '@domain/base/base.error';
import { UserRepository } from '@domain/user-management/user/user.repository';
import { ResetCodeValidSpec, UserEmailMatchedSpec } from '@domain/user-management/user/user.specification';

export class VerifyResetPasswordUseCase {
  constructor(private readonly userRepository: UserRepository, private readonly cryptoService: ICryptoService) {}

  async process(input: VerifyResetPasswordInput): Promise<BaseMessageResponse> {
    const isEmailMatchedSpec = new UserEmailMatchedSpec(input.email);
    const isResetCodeValidSpec = new ResetCodeValidSpec(input.resetCode);

    const user = await this.userRepository.findOneMatched(isEmailMatchedSpec);
    if (!user) throw new DomainError('User not found!');
    if (!isResetCodeValidSpec.isSastifyBy(user)) throw new DomainError('Reset code is incorrect or exprired!');

    user.hashedPassword = this.cryptoService.hash(input.password);
    await this.userRepository.save(user);

    return { message: 'Password reset!' };
  }
}
