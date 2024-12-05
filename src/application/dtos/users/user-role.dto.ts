import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleInput {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  roleName!: string;
}

export class RemoveRoleInput {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  roleName!: string;
}
