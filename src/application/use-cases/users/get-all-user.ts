import { FindAllUserResponse } from '@application/dtos/users/get-all-user.dto';
import { UserRepository } from '@domain/user-management/respositories/user.repository';

export class FindAllUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async process(): Promise<FindAllUserResponse> {
    const users = await this.userRepository.findAll();
    return { items: users };
  }
}
