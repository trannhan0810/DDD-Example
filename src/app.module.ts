import { InMemoryDatabaseModule } from './infrastructure/preservation/database/in-memory/in-memory-db.module';
import { Module } from '@nestjs/common';
import { RestApiModule } from 'src/infrastructure/presentation/rest/restApi.module';

@Module({
  imports: [InMemoryDatabaseModule, RestApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
