import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get appConfig() {
    return {
      port: this.configService.get<number>('PORT'),
      environment: this.configService.get<string>('NODE_ENV'),
    };
  }
}
