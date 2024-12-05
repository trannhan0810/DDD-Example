import { AuthRestApiModule } from './controllers/auth.controller';
import { UserRestApiModule } from './controllers/user.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    /* ================== */
    AuthRestApiModule,
    UserRestApiModule,
  ],
})
export class RestApiModule {}
