import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { CreateUserInput } from '@application/dtos/users/create-user.dto';
import { ICryptoService } from '@application/services/common/cryto';
import { DomainError } from '@domain/base/base.error';
import { UserFactory } from '@domain/user-management/user/user.factory';
import { UserRepository } from '@domain/user-management/user/user.repository';
import { UserEmailMatchedSpec } from '@domain/user-management/user/user.specification';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository, private readonly cryptoService: ICryptoService) {}

  async process(input: CreateUserInput): Promise<BaseMessageResponse> {
    const isEmailMatchedSpec = new UserEmailMatchedSpec(input.email);
    const existUser = await this.userRepository.findOneMatched(isEmailMatchedSpec);
    if (!existUser) throw new DomainError('Email is used!');

    const newUser = UserFactory.create({
      email: input.email,
      firstname: input.firstname,
      lastname: input.lastname,
      hashedPassword: this.cryptoService.hash(input.password),
    });
    await this.userRepository.save(newUser);
    return { message: 'Create user successfully' };
  }
}
