import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YtCreatorService } from './application/services/yt-creator.service';
import { YtCreatorController } from './presentation/controllers/yt-creator.controller';
import { YtCreatorRepository } from './infrastructure/adapters/yt-creator.repository';
import { IYtCreatorRepository } from './domain/ports/yt-creator.repository';
import { YtCreatorEntity } from './infrastructure/entities/yt-creator.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([YtCreatorEntity])],
  providers: [
    YtCreatorService,
    {
      provide: IYtCreatorRepository,
      useClass: YtCreatorRepository,
    },
  ],
  controllers: [YtCreatorController],
  exports: [YtCreatorService],
})
export class YtCreatorModule {}
