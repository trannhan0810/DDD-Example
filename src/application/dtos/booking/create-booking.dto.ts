import { TimeRangeInput } from '../base/date-range-input.dto';

import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingInput {
  @ApiProperty({ type: TimeRangeInput })
  duration!: TimeRangeInput;

  @ApiProperty()
  roomId!: string;

  @ApiProperty()
  customerId!: string;
}
