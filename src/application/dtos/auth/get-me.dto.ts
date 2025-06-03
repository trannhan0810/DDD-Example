import { BasePersonDto } from '../persons/person.dto';

import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetMeResponse extends PickType(BasePersonDto, ['id', 'email', 'firstname', 'lastname']) {
  @Expose()
  roles!: string[];
}
