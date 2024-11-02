import { Module } from '@nestjs/common';
import { RestUserApiModule } from './users/user.controller';
import { InMemoryDatabaseModule } from 'src/preservation/database/in-memory/in-memory-db.module';

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
