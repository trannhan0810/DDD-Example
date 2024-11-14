import { DomainError } from '@domain/base/base.error';

import type { CryptoService } from '@application/services/cryto';
import type { UserRepository } from '@domain/user-management/user/user.repository';
import type { UserSpecificationFactory } from '@domain/user-management/user/user.specification';

export type CreateUserInput = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export class CreateUserUseCase {
  constructor(
    private readonly userSpecFactory: UserSpecificationFactory,
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async process(input: CreateUserInput): Promise<void> {
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
