import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { CreateUserInput } from '@application/dtos/users/create-user.dto';
import { ICryptoService } from '@application/services/common/cryto';
import { DomainError } from '@domain/base/base.error';
import { User } from '@domain/user-management/entities/user.entity';
import { UserRepository } from '@domain/user-management/user/user.repository';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository, private readonly cryptoService: ICryptoService) {}

  async process(input: CreateUserInput): Promise<BaseMessageResponse> {
    const existUser = await this.userRepository.findOneMatched({ email: { isIn: [input.email] } });
    if (!existUser) throw new DomainError('Email is used!');

    const newUser = User.create({
      email: input.email,
      firstname: input.firstname,
      lastname: input.lastname,
      hashedPassword: this.cryptoService.hash(input.password),
    });
    await this.userRepository.save(newUser);
    return new BaseMessageResponse('Create user successfully');
  }
}
