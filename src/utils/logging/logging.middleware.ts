import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {
    this.logger.setLogContext('HTTP');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    // Log request
    this.logger.logRequest(req);

    // Log response
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      this.logger.logResponse(req, res, responseTime);
    });

    next();
  }
}
