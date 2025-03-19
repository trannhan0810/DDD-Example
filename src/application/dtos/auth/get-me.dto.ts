import { BasePersonDto } from '../persons/person.dto';

import { ApiProperty, PickType } from '@nestjs/swagger';

export class GetMeResponse extends PickType(BasePersonDto, ['id', 'email', 'firstname', 'lastname']) {
  @ApiProperty()
  roles!: string[];
}
