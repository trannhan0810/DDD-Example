import { UserRestApiModule } from './users/user.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    /* ================== */
    UserRestApiModule,
  ],
  controllers: [],
  providers: [],
})
export class RestApiModule {}
