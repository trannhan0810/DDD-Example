import type { User } from '@domain/user-management/user/user.entity';
import type { UserRepository } from '@domain/user-management/user/user.repository';

export class FindAllUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async process(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
