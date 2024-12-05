import { BaseUserDto } from './user.dto';

import { ApiProperty, PickType } from '@nestjs/swagger';

import type { FindAllResponse } from '@application/dtos/base/find-all-response.dto';

export class UserListResponse extends PickType(BaseUserDto, ['email', 'firstname', 'lastname']) {}

export class FindAllUserResponse implements FindAllResponse<UserListResponse> {
  @ApiProperty({ type: () => [UserListResponse] })
  items!: UserListResponse[];
}
