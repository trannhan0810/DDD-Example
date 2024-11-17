import { UseCase } from '@application/base/decorator';
import { UserRepository } from '@domain/user-management/user/user.repository';

import type { User } from '@domain/user-management/user/user.entity';

@UseCase()
export class FindAllUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async process(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
