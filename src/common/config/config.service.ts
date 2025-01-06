import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get databaseConfig() {
    return {
      type: 'postgres' as const,
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      schema: this.configService.get<string>('DB_SCHEMA'),
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }
  get appConfig() {
    return {
      port: this.configService.get<number>('PORT'),
      environment: this.configService.get<string>('NODE_ENV'),
    };
  }
}
