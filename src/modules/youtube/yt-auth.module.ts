import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YtAuthService } from './application/services/yt-auth.service';
import { YtAuthController } from './presentation/controllers/yt-auth.controller';
import { YtAuthRepository } from './infrastructure/adapters/yt-auth.repository';
import { IYtAuthRepository } from './domain/ports/yt-auth.repository';
import { YtAuthEntity } from './infrastructure/entities/yt-auth.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([YtAuthEntity])],
  providers: [
    YtAuthService,
    {
      provide: IYtAuthRepository,
      useClass: YtAuthRepository,
    },
  ],
  controllers: [YtAuthController],
})
export class YtAuthModule {}
