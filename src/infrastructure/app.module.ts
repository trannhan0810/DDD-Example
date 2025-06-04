import { CryptoModule } from './adapters/cryto';
import { EmailModule } from './adapters/email';
import { JwtModule } from './adapters/jwt';
import { InMemoryDatabaseModule } from './database/in-memory/in-memory-db.module';
import { AuthGuard } from './presentation/rest/guards/auth.guard';
import { HttpExceptionFilter } from './presentation/rest/middleware/exception-filter.middleware';
import { RestApiModule } from './presentation/rest/restApi.module';

import { ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

@Module({
  imports: [InMemoryDatabaseModule, RestApiModule, CryptoModule, EmailModule, JwtModule],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {}
