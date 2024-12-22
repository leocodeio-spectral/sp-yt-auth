import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingModule } from './utils/logging/logging.module';
import { HealthModule } from './utils/health/health.module';
import { ApiKeyGuard } from './common/guards/x-api-key/x-api-key.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './utils/logging/logging.interceptor';
import { AuthModule } from './common/guards/auth.module';
import { AppConfigModule } from './common/config/config.module';

@Module({
  imports: [LoggingModule, HealthModule, AuthModule, AppConfigModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
