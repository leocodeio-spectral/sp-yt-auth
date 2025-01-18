import {
  Controller,
  Get,
  Query,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { YtAuthService } from '../../application/services/yt-auth.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Public } from '@leocodeio-njs/njs-auth';
import { FileInterceptor } from '@nestjs/platform-express';

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
    const creatorId = await this.ytAuthService.handleOAuthCallback(code);
    return creatorId;
  }

  @Get('channel-info')
  async getChannelInfo(@Query('creatorId') creatorId: string) {
    return this.ytAuthService.getChannelInfo(creatorId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @Query('creatorId') creatorId: string,
    @UploadedFile() videoFile: Express.Multer.File,
    @Body()
    metadata: {
      title: string;
      description: string;
      tags?: string;
      privacyStatus?: 'private' | 'unlisted' | 'public';
    },
  ) {
    return this.ytAuthService.uploadVideo(creatorId, videoFile, {
      ...metadata,
      tags: metadata.tags ? metadata.tags.split(',') : undefined,
    });
  }
}
