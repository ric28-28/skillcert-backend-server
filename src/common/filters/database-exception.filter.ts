import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError, EntityNotFoundError, TypeORMError } from 'typeorm';

@Catch(QueryFailedError, EntityNotFoundError, TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';
    let error = 'Database Error';

    // Handle specific TypeORM errors
    if (exception instanceof QueryFailedError) {
      const err = exception as any;
      
      // PostgreSQL error codes
      switch (err.code) {
        case '23505': // unique_violation
          status = HttpStatus.CONFLICT;
          message = 'Duplicate entry';
          error = 'Conflict Error';
          break;
        case '23503': // foreign_key_violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Related resource not found';
          error = 'Foreign Key Violation';
          break;
        case '23502': // not_null_violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Missing required field';
          error = 'Not Null Violation';
          break;
        case '22P02': // invalid_text_representation
          status = HttpStatus.BAD_REQUEST;
          message = 'Invalid input syntax';
          error = 'Invalid Input';
          break;
        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Database query failed';
          error = 'Query Failed';
      }
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Entity not found';
      error = 'Not Found';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
      ...(process.env.NODE_ENV === 'development' && {
        detail: exception.message,
        stack: exception.stack,
      }),
    };

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }
}