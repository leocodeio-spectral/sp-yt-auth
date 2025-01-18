import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import { IYtCreatorEntity } from '../../../creator/domain/models/yt-creator.model';
import { YtCreatorStatus } from '../../../creator/domain/enums/yt-creator-status.enum';
import { GetCreatorEntryModel } from '../../../creator/domain/enums/get-creator-entry.model';
import { CreateEntryDto } from '../../../creator/application/dtos/create-entry.dto';
import { Inject } from '@nestjs/common';
import { YtCreatorService } from '../../../creator/application/services/yt-creator.service';

@Injectable()
export class YtAuthService {
  private readonly logger = new Logger(YtAuthService.name);
  private readonly CLIENT_SECRETS_FILE =
    './src/modules/common/secrets/client_secret.json';
  private readonly SCOPES = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.upload',
  ];
  private readonly REDIRECT_URI =
    'http://localhost:3001/v1.0/youtube/api/oauth2callback';
  private oauth2Client;

  constructor(
    @Inject(YtCreatorService)
    private readonly ytCreatorService: YtCreatorService,
  ) {
    try {
      const credentials = JSON.parse(
        fs.readFileSync(this.CLIENT_SECRETS_FILE, 'utf8'),
      );

      this.oauth2Client = new google.auth.OAuth2(
        credentials.web.client_id,
        credentials.web.client_secret,
        this.REDIRECT_URI,
      );
    } catch (error) {
      this.logger.error('Failed to initialize OAuth2 client:', error);
    }
  }

  // YouTube connect functions
  async getAuthUrl(): Promise<string> {
    try {
      const authUrl = this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this.SCOPES,
        prompt: 'consent',
      });

      this.logger.log('Generated auth URL:', authUrl);
      return authUrl;
    } catch (error) {
      this.logger.error('Failed to generate auth URL:', error);
      throw new InternalServerErrorException('Authentication failed');
    }
  }

  async handleOAuthCallback(code: string): Promise<IYtCreatorEntity> {
    try {
      this.logger.log(
        'debug log 15 - at ' +
          __filename.split('/').pop() +
          ' - Received OAuth code:',
        code,
      );
      let tokens: any;
      try {
        tokens = (await this.oauth2Client.getToken(code)).tokens;
      } catch (error) {
        this.logger.error('Error getting tokens:', error);
        throw new InternalServerErrorException(
          'Error getting tokens through provided code',
        );
      }
      this.logger.log(
        'debug log 16 - at ' +
          __filename.split('/').pop() +
          ' - Received OAuth tokens',
        tokens,
      );

      if (!tokens.access_token || !tokens.refresh_token) {
        throw new UnauthorizedException('Invalid tokens');
      }

      // Save credentials to database

      try {
        const creatorDto: CreateEntryDto = {
          creatorId: '123e4567-e19b-11d1-a451-121114111111',
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          status: YtCreatorStatus.active,
        };
        this.logger.log(
          'debug log 17 - at ' + __filename.split('/').pop(),
          creatorDto,
        );
        const creator =
          await this.ytCreatorService.createCreatorEntry(creatorDto);
        return creator;
      } catch (error) {
        this.logger.error('Error saving creator:', error);
        throw new InternalServerErrorException('Error saving creator');
      }
    } catch (error) {
      this.logger.error('OAuth callback failed:', error);
      throw error;
    }
  }

  async getChannelInfo(creatorId: string): Promise<any> {
    this.logger.log(
      'debug log 18 - at ' +
        __filename.split('/').pop() +
        ' - Getting channel info for creator:',
      creatorId,
    );
    if (!creatorId) {
      throw new UnauthorizedException('Creator ID is required');
    }
    try {
      // Get latest active creator
      const creator = await this.ytCreatorService.getCreatorEntries({
        creatorId: creatorId,
        status: YtCreatorStatus.active,
      } as GetCreatorEntryModel);

      this.logger.log('Creator found - yt-auth.service.ts', creator);

      if (creator.length === 0) {
        throw new NotFoundException('No authenticated creator found');
      }

      if (creator.length > 1) {
        throw new InternalServerErrorException(
          'Multiple creators found, please contact support',
        );
      }

      // Set credentials
      this.logger.log(
        'OAuth2 client credentials set - yt-auth.service.ts',
        creator,
      );
      this.oauth2Client.setCredentials({
        access_token: creator[0].accessToken,
        refresh_token: creator[0].refreshToken,
      });

      try {
        const youtube = google.youtube({
          version: 'v3',
          auth: this.oauth2Client,
        });

        const response = await youtube.channels.list({
          part: ['snippet', 'contentDetails', 'statistics'],
          mine: true,
        });

        this.logger.log('Channel info:', response.data);

        return response.data;
      } catch (error) {
        this.logger.error('Failed to get channel info:', error);
        throw new InternalServerErrorException(
          'Youtube api Failed to get channel info',
        );
      }
    } catch (error) {
      this.logger.error('Failed to get channel info:', error);
      throw error;
    }
  }
}
