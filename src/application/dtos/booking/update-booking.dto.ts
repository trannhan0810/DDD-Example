import { TimeRangeInput } from '../base/date-range-input.dto';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookingInput {
  @ApiProperty({ type: Number })
  bookingId!: number;

  @ApiProperty({ type: TimeRangeInput, nullable: true })
  duration?: TimeRangeInput;

  @ApiProperty({ nullable: true })
  roomId?: string;

  @ApiProperty({ nullable: true })
  customerId?: string;
}
