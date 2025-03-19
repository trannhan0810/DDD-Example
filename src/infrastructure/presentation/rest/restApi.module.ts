import { AuthRestApiModule } from './controllers/auth.controller';
import { PersonRestApiModule } from './controllers/person.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    /* ================== */
    AuthRestApiModule,
    PersonRestApiModule,
  ],
})
export class RestApiModule {}
