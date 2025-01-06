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
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './common/config/config.service';
import { YtAuthModule } from './modules/youtube/yt-auth.module';

@Module({
  imports: [
    LoggingModule,
    HealthModule,
    AuthModule,
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule, YtAuthModule],
      useFactory: (configService: AppConfigService) => ({
        ...configService.databaseConfig,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [AppConfigService],
    }),
  ],
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
