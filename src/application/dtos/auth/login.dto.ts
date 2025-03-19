import { BasePersonDto } from '../persons/person.dto';

import { ApiProperty, PickType } from '@nestjs/swagger';

export class LoginInput extends PickType(BasePersonDto, ['email']) {
  @ApiProperty()
  password!: string;
}

export class LoginResponse {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;
}
