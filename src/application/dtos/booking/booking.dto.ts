import { TimeRangeResponse } from '../base/date-range-input.dto';

import { BOOKING_PAYMENT_STATUS, BOOKING_STATUS } from '@domain/bookings/entities/booking.entity';
import { ApiProperty } from '@nestjs/swagger';

export class BookingDto {
  @ApiProperty()
  id!: Id;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  customerId!: Id;

  @ApiProperty()
  roomId!: Id;

  @ApiProperty({ type: TimeRangeResponse })
  period!: TimeRangeResponse;

  @ApiProperty({ enum: BOOKING_STATUS })
  status!: BOOKING_STATUS;

  @ApiProperty({ enum: BOOKING_PAYMENT_STATUS })
  paymentStatus!: BOOKING_PAYMENT_STATUS;

  @ApiProperty()
  totalPrice!: number;
}
