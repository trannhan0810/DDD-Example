import { ApiProperty } from '@nestjs/swagger';

export class TimeRangeInput {
  @ApiProperty()
  start!: Date;

  @ApiProperty()
  end!: Date;
}

export class TimeRangeResponse {
  @ApiProperty()
  start!: Date;

  @ApiProperty()
  end!: Date;
}
