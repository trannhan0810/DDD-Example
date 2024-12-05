import { ApiProperty } from '@nestjs/swagger';

export class BaseMessageResponse {
  @ApiProperty()
  message!: string;
}
