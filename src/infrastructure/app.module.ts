import { CryptoModule } from './adapter/cryto';
import { EmailModule } from './adapter/email';
import { JwtModule } from './adapter/jwt';
import { RestApiModule } from './presentation/rest/restApi.module';
import { InMemoryDatabaseModule } from './preservation/database/in-memory/in-memory-db.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [InMemoryDatabaseModule, RestApiModule, CryptoModule, EmailModule, JwtModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
