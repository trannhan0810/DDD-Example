import { TimeRangeInput } from '../shared/date-range-input.dto';

import { BOOKING_STATUS } from '@domain/bookings/entities/booking.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingInput {
  @ApiProperty({ type: TimeRangeInput })
  period!: TimeRangeInput;

  @ApiProperty()
  roomId!: string;

  @ApiProperty()
  customerId!: string;

  @ApiProperty()
  status!: BOOKING_STATUS.Unconfirmed | BOOKING_STATUS.Confirmed;
}
