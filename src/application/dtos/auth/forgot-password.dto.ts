import { BasePersonDto } from '../persons/person.dto';

import { PickType } from '@nestjs/swagger';

export class ForgotPasswordInput extends PickType(BasePersonDto, ['email']) {}
