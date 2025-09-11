import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply global exception filters
  app.useGlobalFilters(
    new DatabaseExceptionFilter(),
    new AllExceptionsFilter()
  );

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
