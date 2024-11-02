import type { CryptoService } from '@application/third-party-service/cryto';
import { DomainError } from '@domain/base/base.error';
import type { User } from '@domain/user-management/user/user.entity';
import type { UserRepository } from '@domain/user-management/user/user.repository';
import type { UserSpecificationFactory } from '@domain/user-management/user/user.specification';

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export class LoginUseCase {
  constructor(
    private readonly userSpecFactory: UserSpecificationFactory,
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async process(input: LoginInput): Promise<LoginResponse> {
    const hashedPassword = this.cryptoService.hash(input.password);

    const isEmailMatchedSpec = this.userSpecFactory.isEmailMatched(input.email);
    const isPasswordMatchedSpec = this.userSpecFactory.isPasswordMatched(hashedPassword);
    const isEmailAndPasswordCorrectSpec = isEmailMatchedSpec.and(isPasswordMatchedSpec);

    const user = await this.userRepository.findOneMatched(isEmailAndPasswordCorrectSpec);
    if (!user) throw new DomainError('Email or password is incorrect');

    return this.generateToken(user);
  }

  private generateToken(user: User) {
    return { accessToken: `${user}`, refreshToken: `${user}` };
  }
}
