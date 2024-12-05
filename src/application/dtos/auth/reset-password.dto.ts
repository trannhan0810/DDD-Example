import { BaseUserDto } from '../users/user.dto';

import { PickType } from '@nestjs/swagger';

export class ResetPasswordInput extends PickType(BaseUserDto, ['email']) {}
