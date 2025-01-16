import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { YtAuthService } from './application/services/yt-auth.service';
import { YtAuthController } from './presentation/controllers/yt-auth.controller';

@Module({
  imports: [ConfigModule],
  providers: [YtAuthService],
  controllers: [YtAuthController],
})
export class YtAuthModule {}
