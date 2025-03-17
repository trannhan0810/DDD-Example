import { AssignRoleInput } from '@application/dtos/users/user-role.dto';
import { DomainError } from '@domain/base/base.error';
import { RoleRepository } from '@domain/staff/repositories/role.repository';
import { UserRepository } from '@domain/user-management/respositories/user.repository';

export class AssignRoleUseCase {
  constructor(private readonly roleRepository: RoleRepository, private readonly userRepository: UserRepository) {}

  async process(input: AssignRoleInput): Promise<void> {
    const personId = input.userId;
    const role = await this.roleRepository.findOneMatched({ personId: { isIn: [personId] } });
    if (!role) throw new DomainError(`Role ${input.roleName} not found!`);

    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new DomainError(`User ${input.userId} not found!`);

    await this.userRepository.addRoles(user.id, [role.id]);
  }
}
