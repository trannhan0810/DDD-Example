import { BaseUserDto } from '../users/user.dto';

import { PickType } from '@nestjs/swagger';

export class ForgotPasswordInput extends PickType(BaseUserDto, ['email']) {}
