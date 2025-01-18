import { Controller, Get, Query } from '@nestjs/common';
import { YtAuthService } from '../../application/services/yt-auth.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Public } from '@leocodeio-njs/njs-auth';

@ApiTags('Youtube')
@ApiSecurity('x-api-key')
@Controller('youtube/api')
export class YtAuthController {
  constructor(private readonly ytAuthService: YtAuthService) {}

  // YouTube connect endpoints
  @Get('auth')
  async authenticateYouTube() {
    return this.ytAuthService.getAuthUrl();
  }

  @Public()
  @Get('oauth2callback')
  async handleOAuthCallback(@Query('code') code: string) {
    return this.ytAuthService.handleOAuthCallback(code);
  }

  @Get('channel-info')
  async getChannelInfo(@Query('creatorId') creatorId: string) {
    return this.ytAuthService.getChannelInfo(creatorId);
  }
}
