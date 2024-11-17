import { AuthRestApiModule } from './auth/auth.controller';
import { UserRestApiModule } from './users/user.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    /* ================== */
    AuthRestApiModule,
    UserRestApiModule,
  ],
})
export class RestApiModule {}
