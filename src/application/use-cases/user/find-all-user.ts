import { UserRepository } from '@domain/user-management/user/user.repository';
import { Injectable } from '@nestjs/common';

import type { User } from '@domain/user-management/user/user.entity';

@Injectable()
export class FindAllUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async process(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
