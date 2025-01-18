import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { YtCreatorStatus } from '../../domain/enums/yt-creator-status.enum';
import { IYtCreatorEntity } from '../../domain/models/yt-auth.model';
import { IYtAuthRepository } from '../../domain/ports/yt-auth.repository';
import { CreateEntryDto } from '../dtos/create-entry.dto';
import { GetCreatorEntryModel } from '../../domain/enums/get-creator-entry.model';
import { google } from 'googleapis';
import * as fs from 'fs';

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
    'http://localhost:3001/v1.0/youtube/oauth2callback';
  private oauth2Client;

  constructor(private readonly ytAuthRepository: IYtAuthRepository) {
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
      throw new Error('Authentication failed');
    }
  }

  async handleOAuthCallback(code: string): Promise<IYtCreatorEntity> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.logger.log('Received OAuth tokens');

      // Save credentials to database
      const creatorDto: CreateEntryDto = {
        creatorId: '123e4567-e19b-11d1-a451-121114111111',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        status: YtCreatorStatus.ACTIVE,
      };

      return this.createCreatorEntry(creatorDto);
    } catch (error) {
      this.logger.error('OAuth callback failed:', error);
      throw new Error('Failed to complete authentication');
    }
  }

  async getChannelInfo(): Promise<any> {
    try {
      // Get latest active creator
      const creator = await this.getCreatorEntries({
        creatorId: '123e4567-e19b-11d1-a451-121114111111',
        status: YtCreatorStatus.ACTIVE,
      });

      this.logger.log('Creator found - yt-auth.service.ts', creator);

      if (creator instanceof Array && creator.length === 0) {
        throw new UnauthorizedException('No authenticated creator found');
      }

      if (creator instanceof Array && creator.length > 1) {
        throw new UnauthorizedException('Multiple creators found');
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
      throw new Error('Failed to get channel information');
    }
  }

  // creator functions
  async createCreatorEntry(
    creatorDto: CreateEntryDto,
  ): Promise<IYtCreatorEntity> {
    try {
      this.logger.log(
        'debug log 1 - at ' + __filename.split('/').pop() + ' - creator input:',
        JSON.stringify(creatorDto),
      );
      const creator = await this.ytAuthRepository.save(creatorDto);
      this.logger.log(
        'debug log 2 - at ' +
          __filename.split('/').pop() +
          ' - creator created:',
        JSON.stringify(creator),
      );
      return creator;
      // return {
      //   id: Math.random().toString(36).substr(2, 9),
      //   creatorId: creatorDto.creatorId,
      //   accessToken: creatorDto.accessToken,
      //   refreshToken: creatorDto.refreshToken,
      //   status: creatorDto.status || YtCreatorStatus.ACTIVE,
      // } as IYtCreatorEntity;
    } catch (error) {
      this.logger.error(
        'error log 3 - at ' +
          __filename.split('/').pop() +
          ' - creator creation failed:',
        JSON.stringify(error),
      );
      throw new Error('Creator not created');
    }
  }
  // [TODO] - Make both of this function to be one
  async getCreatorEntries(
    query: GetCreatorEntryModel,
  ): Promise<IYtCreatorEntity[] | IYtCreatorEntity> {
    try {
      this.logger.log(
        'debug log 4 - at ' +
          __filename.split('/').pop() +
          ' - searching with query:',
        JSON.stringify(query),
      );
      if (query.creatorId && query.status) {
        const creator = await this.ytAuthRepository.find({
          creatorId: query.creatorId,
          status: query.status,
        });
        this.logger.log(
          'debug log 5 - at ' +
            __filename.split('/').pop() +
            ' - creator found:',
          JSON.stringify(creator),
        );
        if (!creator) {
          throw new Error('Creator not found');
        }
        return creator;
      } else if (query.creatorId) {
        const creator = await this.ytAuthRepository.find({
          creatorId: query.creatorId,
        });
        this.logger.log(
          'debug log 5 - at ' +
            __filename.split('/').pop() +
            ' - creator found:',
          JSON.stringify(creator),
        );
        if (creator instanceof Array && creator.length === 0) {
          throw new NotFoundException('Creator not found');
        }
        return creator;
      } else if (query.status) {
        const creator = await this.ytAuthRepository.find({
          status: query.status,
        });
        this.logger.log(
          'debug log 5 - at ' +
            __filename.split('/').pop() +
            ' - creator found:',
          JSON.stringify(creator),
        );
        return creator;
      } else {
        const creators = await this.ytAuthRepository.find(query);
        this.logger.log(
          'debug log 5 - at ' +
            __filename.split('/').pop() +
            ' - creators found:',
          JSON.stringify(creators),
        );
        return creators;
      }
      // return {
      //   id: query.id || '1',
      //   creatorId: '1',
      //   accessToken: '1',
      //   refreshToken: '1',
      //   status: query.status || YtCreatorStatus.ACTIVE,
      // } as IYtCreatorEntity;
    } catch (error) {
      this.logger.error(
        'error log 6 - at ' +
          __filename.split('/').pop() +
          ' - creator search failed:',
        JSON.stringify(error),
      );
      throw new NotFoundException('Creator not found');
    }
  }

  async updateCreatorEntry(
    creatorId: string,
    updateDto: Partial<IYtCreatorEntity>,
  ): Promise<IYtCreatorEntity> {
    try {
      this.logger.log(
        'debug log 7 - at ' +
          __filename.split('/').pop() +
          ' - updating creator:',
        JSON.stringify({ creatorId, updateDto }),
      );

      // find the creator by id
      this.logger.log(
        'debug log 8 - at ' + __filename.split('/').pop() + ' - creator found',
        creatorId,
      );
      const existingCreator = await this.ytAuthRepository.find({
        creatorId,
      });

      if (!existingCreator) {
        // [TODO] - Handle error more efficiently
        this.logger.error(
          'error log 9 - at ' +
            __filename.split('/').pop() +
            ' - Creator not found',
          creatorId,
        );
        throw new Error('Creator not found');
      }
      // Duplicate error
      // [TODO] - handle multiple creators efficiently
      if (existingCreator instanceof Array) {
        // [TODO] - Handle error more efficiently
        this.logger.error(
          'error log 10 - at ' +
            __filename.split('/').pop() +
            ' - Multiple creators found',
        );
        throw new Error('Multiple creators found');
      }

      this.logger.log(
        'debug log 11 - at ' + __filename.split('/').pop() + ' - creator found',
        existingCreator,
      );

      // update the creator
      updateDto.status && (existingCreator.status = updateDto.status);
      updateDto.accessToken &&
        (existingCreator.accessToken = updateDto.accessToken);
      updateDto.refreshToken &&
        (existingCreator.refreshToken = updateDto.refreshToken);
      existingCreator.updatedAt = new Date();
      // save updated creator
      const creator = await this.ytAuthRepository.save(existingCreator);
      this.logger.log(
        'debug log 12 - at ' +
          __filename.split('/').pop() +
          ' - creator updated:',
        JSON.stringify(creator),
      );
      // return {
      //   id: creatorId,
      //   creatorId: '1',
      //   accessToken: '1',
      //   refreshToken: '1',
      //   status: updateDto.status || YtCreatorStatus.ACTIVE,
      // } as IYtCreatorEntity;
      return creator;
    } catch (error) {
      this.logger.error(
        'error log 13 - at ' +
          __filename.split('/').pop() +
          ' - creator update failed:',
        JSON.stringify(error),
      );
      throw new Error('Creator not updated');
    }
  }

  async deleteCreatorEntry(creatorId: string): Promise<string> {
    try {
      this.logger.log(
        'debug log 14',
        'debug log 14 - at ' +
          __filename.split('/').pop() +
          ' - deleting creator:',
        creatorId,
      );
      const creator = await this.ytAuthRepository.delete(creatorId);
      this.logger.log(
        'debug log 15 - at ' +
          __filename.split('/').pop() +
          ' - creator deleted:',
        JSON.stringify(creator),
      );
      // return {
      //   id: creatorId,
      //   creatorId: '1',
      // } as IYtCreatorEntity;
      return `Creator with Id ${creatorId} deleted successfully!!!`;
    } catch (error) {
      this.logger.error(
        'error log 16 - at ' +
          __filename.split('/').pop() +
          ' - creator deletion failed:',
        JSON.stringify(error),
      );
      throw new Error('Creator not deleted');
    }
  }
}
