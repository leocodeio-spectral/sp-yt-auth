import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../domain.exception';
import { ApplicationException } from '../application.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      message =
        typeof response === 'string' ? response : (response as any).message;
      error =
        typeof response === 'string' ? exception.name : (response as any).error;
    } else if (exception instanceof ApplicationException) {
      status = exception.statusCode;
      message = exception.message;
      error = exception.name;
    } else if (exception instanceof DomainException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      error = exception.name;
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
