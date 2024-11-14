import { RestUserApiModule } from './users/user.controller';

import { Module } from '@nestjs/common';
import { InMemoryDatabaseModule } from 'src/infrastructure/preservation/database/in-memory/in-memory-db.module';

@Module({
  imports: [
    //Preservation modules
    InMemoryDatabaseModule,

    //Presentation modules
    RestUserApiModule,

    //Other 3-rd party modules
  ],
  controllers: [],
  providers: [],
})
export class RestApiModule {}
