import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YtAuthService } from './application/services/yt-auth.service';
import { YtAuthController } from './presentation/controllers/yt-auth.controller';
import { YtCreatorEntity } from '../creator/infrastructure/entities/yt-creator.entity';
import { IYtCreatorRepository } from '../creator/domain/ports/yt-creator.repository';
import { YtCreatorRepository } from '../creator/infrastructure/adapters/yt-creator.repository';
import { YtCreatorModule } from '../creator/yt-creator.module';

@Module({
  imports: [
    ConfigModule,
    YtCreatorModule,
    TypeOrmModule.forFeature([YtCreatorEntity]),
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
