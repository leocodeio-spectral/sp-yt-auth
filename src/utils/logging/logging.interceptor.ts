// src/logging/logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setLogContext('LoggingInterceptor');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = this.getRequest(context);
    const method = request.method;
    const url = request.url;
    const controller = context.getClass().name;
    const handler = context.getHandler().name;
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    // Log incoming request
    const requestLog = {
      requestId,
      type: 'REQUEST',
      method,
      url,
      controller: `${controller}.${handler}`,
      body: this.truncateData(request.body),
      query: this.truncateData(request.query),
      params: this.truncateData(request.params),
    };

    this.logger.log({
      message: `→ ${method} ${url}`,
      ...this.formatLogObject(requestLog),
    });

    return next.handle().pipe(
      tap({
        next: (response: any) => {
          const duration = Date.now() - startTime;

          // Log successful response
          const responseLog = {
            requestId,
            type: 'RESPONSE',
            method,
            url,
            controller: `${controller}.${handler}`,
            duration: `${duration}ms`,
            response: this.formatResponse(response),
          };

          this.logger.log({
            message: `← ${method} ${url} [${duration}ms]`,
            ...this.formatLogObject(responseLog),
          });
        },
        error: (error: any) => {
          const duration = Date.now() - startTime;

          // Log error response
          const errorLog = {
            requestId,
            type: 'ERROR',
            method,
            url,
            controller: `${controller}.${handler}`,
            duration: `${duration}ms`,
            error: {
              name: error.name,
              message: error.message,
              code: error.code || 'UNKNOWN',
              stack: this.formatErrorStack(error.stack),
            },
          };

          this.logger.error({
            message: `⚠ ${method} ${url} [${duration}ms] - ${error.message}`,
            ...this.formatLogObject(errorLog),
          });
        },
      }),
    );
  }

  private getRequest(context: ExecutionContext): any {
    return context.switchToHttp().getRequest();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatLogObject(obj: any): any {
    return {
      ...obj,
      timestamp: new Date().toISOString(),
    };
  }

  private formatResponse(response: any): any {
    if (!response) return null;

    // If response is an array
    if (Array.isArray(response)) {
      return `Array[${response.length} items]`;
    }

    // If response is an object
    if (typeof response === 'object') {
      const formatted = {};
      Object.keys(response).forEach((key) => {
        const value = response[key];
        if (typeof value === 'object' && value !== null) {
          formatted[key] = this.truncateData(value);
        } else {
          formatted[key] = value;
        }
      });
      return formatted;
    }

    return response;
  }

  private truncateData(data: any, maxLength: number = 100): any {
    if (!data) return data;

    if (typeof data === 'string') {
      return data.length > maxLength
        ? `${data.substring(0, maxLength)}...`
        : data;
    }

    if (Array.isArray(data)) {
      return `Array[${data.length} items]`;
    }

    if (typeof data === 'object') {
      const keys = Object.keys(data);
      return `Object{${keys.length} keys}`;
    }

    return data;
  }

  private formatErrorStack(stack: string): string[] {
    if (!stack) return [];
    return stack
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('at '))
      .slice(0, 3) // Only keep first 3 stack lines
      .map((line) => line.replace(/\s+/g, ' '));
  }
}
