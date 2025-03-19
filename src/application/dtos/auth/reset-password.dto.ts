import { BasePersonDto } from '../persons/person.dto';

import { ApiProperty, PickType } from '@nestjs/swagger';

export class ResetPasswordInput extends PickType(BasePersonDto, ['email']) {
  @ApiProperty()
  password!: string;

  @ApiProperty()
  resetCode!: string;
}
