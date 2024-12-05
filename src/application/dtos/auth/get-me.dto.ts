import { BaseUserDto } from '../users/user.dto';

import { ApiProperty, PickType } from '@nestjs/swagger';

export class GetMeResponse extends PickType(BaseUserDto, ['id', 'email', 'firstname', 'lastname']) {
  @ApiProperty()
  roles!: string[];
}
