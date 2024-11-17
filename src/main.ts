/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { AppModule } from '@infrastructure/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  /** Setup Validation Pipe */
  app.useGlobalPipes(new ValidationPipe());

  /** Setup Swagger */
  const config = new DocumentBuilder().setTitle('DDD Example - Booking management').setVersion('1.0').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

void bootstrap();
