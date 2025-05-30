import { CryptoModule } from './adapters/cryto';
import { EmailModule } from './adapters/email';
import { JwtModule } from './adapters/jwt';
import { InMemoryDatabaseModule } from './database/in-memory/in-memory-db.module';
import { HttpExceptionFilter } from './presentation/rest/middleware/exception-filter.middleware';
import { RestApiModule } from './presentation/rest/restApi.module';

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [InMemoryDatabaseModule, RestApiModule, CryptoModule, EmailModule, JwtModule],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}
