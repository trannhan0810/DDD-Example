import { UserDetailResponse } from '@application/dtos/users/get-one-user.dto';
import { DomainError } from '@domain/base/base.error';
import { UserRepository } from '@domain/user-management/respositories/user.repository';

export class GetUserDetailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async process(id: string): Promise<UserDetailResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new DomainError('User not found!');
    return user;
  }
}
