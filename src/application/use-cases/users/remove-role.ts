import { BaseMessageResponse } from '@application/dtos/base/message-response.dto';
import { RemoveRoleInput } from '@application/dtos/users/user-role.dto';
import { DomainError } from '@domain/base/base.error';
import { RoleRepository } from '@domain/permission-management/repositories/role.repository';
import { UserRepository } from '@domain/user-management/user/user.repository';

export class RemoveRoleUseCase {
  constructor(private readonly userRepository: UserRepository, private readonly roleRepository: RoleRepository) {}

  async process(input: RemoveRoleInput): Promise<BaseMessageResponse> {
    const personId = input.userId;
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new DomainError(`User ${input.userId} not found!`);

    const role = await this.roleRepository.findOneMatched({ personId: { isIn: [personId] } });
    if (!role) return new BaseMessageResponse('Role not assigned to this person', false);

    await this.userRepository.removeRoles(user.id, [role.id]);
    return new BaseMessageResponse('Role removed successfully');
  }
}
