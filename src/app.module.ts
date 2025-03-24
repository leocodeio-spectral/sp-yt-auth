import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingModule } from '@leocodeio-njs/njs-logging';
import { HealthModule } from '@leocodeio-njs/njs-health';
import { ApiKeyGuard } from '@leocodeio-njs/njs-auth';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@leocodeio-njs/njs-logging';
import { AuthModule } from '@leocodeio-njs/njs-auth';
import { AppConfigModule } from '@leocodeio-njs/njs-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from '@leocodeio-njs/njs-config';
import { YtAuthModule } from './modules/youtube/yt-auth.module';
import { YtCreatorModule } from './modules/creator/yt-creator.module';

@Module({
  imports: [
    LoggingModule,
    HealthModule,
    AuthModule,
    AppConfigModule,
    YtAuthModule,
    YtCreatorModule,
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
