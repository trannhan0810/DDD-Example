import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Max, Min, ValidateNested } from 'class-validator';

export class CordinateInput {
  @Min(-180)
  @Max(180)
  @ApiProperty()
  longitude!: number;

  @Min(-90)
  @Max(90)
  @ApiProperty()
  latitude!: number;
}

export class SearchCordinateInput {
  @ValidateNested()
  @Type(() => CordinateInput)
  @ApiProperty({ type: CordinateInput })
  cordinate!: CordinateInput;

  @ApiProperty()
  range!: number;
}
