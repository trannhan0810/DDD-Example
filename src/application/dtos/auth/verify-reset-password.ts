import { BaseUserDto } from '../users/user.dto';

import { ApiProperty, PickType } from '@nestjs/swagger';

export class VerifyResetPasswordInput extends PickType(BaseUserDto, ['email']) {
  @ApiProperty()
  password!: string;

  @ApiProperty()
  resetCode!: string;
}
