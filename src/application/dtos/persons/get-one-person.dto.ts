import { BasePersonDto } from './person.dto';

import { PickType } from '@nestjs/swagger';

export class PersonDetailResponse extends PickType(BasePersonDto, [
  'id',
  'email',
  'firstname',
  'lastname',
  'isEmailVerified',
]) {}
