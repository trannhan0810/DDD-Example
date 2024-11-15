import { DomainError } from '@domain/base/base.error';
import { UserRepository } from '@domain/user-management/user/user.repository';
import { Injectable } from '@nestjs/common';

import type { User } from '@domain/user-management/user/user.entity';

@Injectable()
export class FindOneUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async process(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new DomainError('User not found!');
    return user;
  }
}
