import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleInput {
  @ApiProperty()
  personId!: string;

  @ApiProperty()
  roleName!: string;
}

export class RemoveRoleInput {
  @ApiProperty()
  personId!: string;

  @ApiProperty()
  roleName!: string;
}
