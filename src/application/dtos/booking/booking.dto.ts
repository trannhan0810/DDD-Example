import { TimeRangeResponse } from '../base/date-range-input.dto';

import { BOOKING_CONFIRM_STATUS, BOOKING_PAYMENT_STATUS } from '@domain/booking-management/entities/booking.entity';
import { ApiProperty } from '@nestjs/swagger';

export class BookingDto {
  @ApiProperty()
  id!: Id;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  customerId!: Id;

  @ApiProperty()
  venueId!: Id;

  @ApiProperty({ type: TimeRangeResponse })
  period!: TimeRangeResponse;

  @ApiProperty({ enum: BOOKING_CONFIRM_STATUS })
  status!: BOOKING_CONFIRM_STATUS;

  @ApiProperty({ enum: BOOKING_PAYMENT_STATUS })
  paymentStatus!: BOOKING_PAYMENT_STATUS;

  @ApiProperty()
  totalPrice!: number;
}
