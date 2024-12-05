import { ApiProperty } from '@nestjs/swagger';

export class DateRangeInput {
  @ApiProperty()
  startTime!: Date;

  @ApiProperty()
  endTime!: Date;
}
