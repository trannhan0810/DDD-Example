import type { CryptoService } from '@application/third-party-service/cryto';
import { DomainError } from '@domain/base/base.error';
import type { UserRepository } from '@domain/user-management/user/user.repository';
import type { UserSpecificationFactory } from '@domain/user-management/user/user.specification';

export type RegisterInput = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export class LoginUseCase {
  constructor(
    private readonly userSpecFactory: UserSpecificationFactory,
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async process(input: RegisterInput): Promise<void> {
    const isEmailMatchedSpec = this.userSpecFactory.isEmailMatched(input.email);
    const existUser = await this.userRepository.findOneMatched(isEmailMatchedSpec);
    if (!existUser) throw new DomainError('Email is used!');

    const newUser = this.userRepository.factory.create({
      email: input.email,
      firstname: input.firstname,
      lastname: input.lastname,
      hashedPassword: this.cryptoService.hash(input.password),
    });
    return void this.userRepository.save(newUser);
  }
}
