import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';
import { RequestTimeoutInterceptor } from './common/interceptors/request-timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply global exception filters
  app.useGlobalFilters(
    new DatabaseExceptionFilter(),
    new AllExceptionsFilter()
  );

  // Apply global validation pipe with best-practice options
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Apply request timeout interceptor
  app.useGlobalInterceptors(new RequestTimeoutInterceptor(5000));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
