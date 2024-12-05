import { BaseUserDto } from './user.dto';

import { ApiProperty, PickType } from '@nestjs/swagger';

export class CreateUserInput extends PickType(BaseUserDto, ['email', 'firstname', 'lastname']) {
  @ApiProperty()
  password!: string;
}
