import { BaseUserDto } from '../users/user.dto';

import { ApiProperty, PickType } from '@nestjs/swagger';

export class LoginInput extends PickType(BaseUserDto, ['email']) {
  @ApiProperty()
  password!: string;
}

export class LoginResponse {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;
}
