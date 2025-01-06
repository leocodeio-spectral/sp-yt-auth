import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/common/guards/auth.module';
import { YtAuthService } from './application/services/yt-auth.service';
import { YtAuthController } from './presentation/controllers/yt-auth.controller';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [YtAuthService],
  controllers: [YtAuthController],
})
export class YtAuthModule {}
