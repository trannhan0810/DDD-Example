import { ApiProperty } from '@nestjs/swagger';

export class BaseMessageResponse {
  @ApiProperty()
  success: boolean = true;

  @ApiProperty()
  message!: string;

  constructor(message: string, success: boolean = true) {
    this.message = message;
    this.success = success;
  }
}
