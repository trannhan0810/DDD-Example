import { VerifyResetPasswordInput } from '@application/dtos/auth/verify-reset-password';
import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { ICryptoService } from '@application/services/common/cryto';
import { DomainError } from '@domain/base/base.error';
import { UserRepository } from '@domain/user-management/user/user.repository';

export class VerifyResetPasswordUseCase {
  constructor(private readonly userRepository: UserRepository, private readonly cryptoService: ICryptoService) {}

  async process(input: VerifyResetPasswordInput): Promise<BaseMessageResponse> {
    const user = await this.userRepository.findOneMatched({ email: { isIn: [input.email] } });
    if (!user) throw new DomainError('User not found!');
    user.verifyResetCode(input.resetCode);

    user.hashedPassword = this.cryptoService.hash(input.password);
    await this.userRepository.save(user);

    return new BaseMessageResponse('Password reset!');
  }
}
