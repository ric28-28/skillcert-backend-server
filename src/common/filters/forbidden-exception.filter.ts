import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errorResponse = {
      statusCode: HttpStatus.FORBIDDEN,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      method: ctx.getRequest().method,
      message: 'Access Denied - Insufficient permissions',
      error: 'Forbidden',
      details:
        exception.message ||
        'You do not have permission to access this resource',
    };

    response.status(status).json(errorResponse);
  }
}
