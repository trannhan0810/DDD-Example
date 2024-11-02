import { DomainError } from '@domain/base/base.error';
import type { User } from '@domain/user-management/user/user.entity';
import type { UserRepository } from '@domain/user-management/user/user.repository';

export class FindOneUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async process(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new DomainError('User not found!');
    return user;
  }
}
