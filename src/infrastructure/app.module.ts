import { CryptoModule } from './adapters/cryto';
import { EmailModule } from './adapters/email';
import { JwtModule } from './adapters/jwt';
import { InMemoryDatabaseModule } from './persistence/database/in-memory/in-memory-db.module';
import { RestApiModule } from './presentation/rest/restApi.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [InMemoryDatabaseModule, RestApiModule, CryptoModule, EmailModule, JwtModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
