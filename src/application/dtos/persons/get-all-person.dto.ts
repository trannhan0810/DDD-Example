import { BasePersonDto } from './person.dto';

import { ApiProperty, PickType } from '@nestjs/swagger';

import type { FindAllResponse } from '@application/dtos/shared/find-all-response.dto';

export class PersonListResponse extends PickType(BasePersonDto, ['email', 'firstname', 'lastname']) {}

export class FindAllPersonResponse implements FindAllResponse<PersonListResponse> {
  @ApiProperty({ type: () => [PersonListResponse] })
  items!: PersonListResponse[];
}
