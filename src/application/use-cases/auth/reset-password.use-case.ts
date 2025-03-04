import { ResetPasswordInput } from '@application/dtos/auth/reset-password';
import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { ICryptoService } from '@application/services/common/cryto';
import { DomainError } from '@domain/base/base.error';
import { UserRepository } from '@domain/user-management/user/user.repository';

export class ResetPasswordUseCase {
  constructor(private readonly userRepository: UserRepository, private readonly cryptoService: ICryptoService) {}

  async process(input: ResetPasswordInput): Promise<BaseMessageResponse> {
    const user = await this.userRepository.findOneMatched({ email: { isIn: [input.email] } });
    if (!user) throw new DomainError('User not found!');
    user.verifyResetPasswordCode(input.resetCode);

    user.hashedPassword = this.cryptoService.hash(input.password);
    await this.userRepository.save(user);

    return new BaseMessageResponse('Password reset!');
  }
}
