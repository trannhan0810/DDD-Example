import { Module } from '@nestjs/common';
import { RestApiModule } from '@presentation/rest/restApi.module';
import { InMemoryDatabaseModule } from './preservation/database/in-memory/in-memory-db.module';

@Module({
  imports: [InMemoryDatabaseModule, RestApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
