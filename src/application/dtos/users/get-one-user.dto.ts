import { BaseUserDto } from './user.dto';

import { PickType } from '@nestjs/swagger';

export class UserDetailResponse extends PickType(BaseUserDto, [
  'id',
  'email',
  'firstname',
  'lastname',
  'isEmailVerified',
]) {}
