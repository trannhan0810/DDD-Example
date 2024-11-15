import { ICryptoService } from '@application/services/cryto';
import { DomainError } from '@domain/base/base.error';
import { UserRepository } from '@domain/user-management/user/user.repository';
import { UserEmailMatchedSpec } from '@domain/user-management/user/user.specification';
import { Injectable } from '@nestjs/common';

export type CreateUserInput = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository, private readonly cryptoService: ICryptoService) {}

  async process(input: CreateUserInput): Promise<void> {
    const isEmailMatchedSpec = new UserEmailMatchedSpec(input.email);
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
