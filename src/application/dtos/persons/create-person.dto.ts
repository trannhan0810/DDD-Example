import { BasePersonDto } from './person.dto';

import { ApiProperty, PickType } from '@nestjs/swagger';

export class CreatePersonInput extends PickType(BasePersonDto, ['email', 'firstname', 'lastname']) {
  @ApiProperty()
  password!: string;
}
