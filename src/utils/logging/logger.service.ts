import { Injectable, Scope } from '@nestjs/common';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { Request } from 'express';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends WinstonLogger {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) logger: Logger) {
    super(logger);
  }

  logRequest(req: Request, message?: string) {
    const requestData = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
      body: req.body,
    };

    this.log({
      message: message || 'Incoming request',
      ...requestData,
    });
  }

  logResponse(req: Request, res: any, responseTime: number) {
    this.log({
      message: 'Response sent',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
    });
  }

  setLogContext(context: string) {
    this.setContext(context);
  }
}
