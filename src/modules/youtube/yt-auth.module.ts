import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YtAuthService } from './application/services/yt-auth.service';
import { YtAuthController } from './presentation/controllers/yt-auth.controller';
import { YtCreatorEntity } from '../creator/infrastructure/entities/yt-creator.entity';
import { IYtCreatorRepository } from '../creator/domain/ports/yt-creator.repository';
import { YtCreatorRepository } from '../creator/infrastructure/adapters/yt-creator.repository';
import { YtCreatorModule } from '../creator/yt-creator.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule,
    YtCreatorModule,
    TypeOrmModule.forFeature([YtCreatorEntity]),
    MulterModule.register({
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
      },
    }),
  ],
  providers: [
    YtAuthService,
    {
      provide: IYtCreatorRepository,
      useClass: YtCreatorRepository,
    },
  ],
  controllers: [YtAuthController],
})
export class YtAuthModule {}
