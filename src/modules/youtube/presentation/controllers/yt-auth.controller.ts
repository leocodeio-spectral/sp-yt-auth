import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { YtAuthService } from '../../application/services/yt-auth.service';
import { YtCreatorStatus } from '../../domain/enums/yt-creator-status.enum';
import { CreateEntryDto } from '../../application/dtos/create-entry.dto';
import { UpdateEntryDto } from '../../application/dtos/update-entry.dto';
import { IYtCreatorEntity } from '../../domain/models/yt-auth.model';
import { ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { GetCreatorEntryModel } from '../../domain/enums/get-creator-entry.model';
import { Public } from '@leocodeio-njs/njs-auth';

@ApiTags('Youtube')
@ApiSecurity('x-api-key')
@Controller('youtube')
export class YtAuthController {
  constructor(private readonly ytAuthService: YtAuthService) {}

  // creator endpoints
  @Post('creator')
  async createCreatorEntry(
    @Body() creatorDto: CreateEntryDto,
  ): Promise<IYtCreatorEntity> {
    return this.ytAuthService.createCreatorEntry(creatorDto);
  }

  @Get('creator')
  @ApiQuery({
    name: 'creatorId',
    required: false,
    description: 'Filter by creator ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: YtCreatorStatus,
    description: 'Filter by status',
  })
  async getCreatorEntries(
    @Query('creatorId') creatorId?: string,
    @Query('status') status?: YtCreatorStatus,
  ): Promise<IYtCreatorEntity[] | IYtCreatorEntity> {
    const query: GetCreatorEntryModel = {
      creatorId: creatorId ? creatorId : undefined,
      status: status ? status : undefined,
    };
    return this.ytAuthService.getCreatorEntries(query);
  }

  @Put('creator')
  async updateCreatorEntry(
    @Query('creatorId') creatorId: string,
    @Body() updateDto: UpdateEntryDto,
  ): Promise<IYtCreatorEntity> {
    return this.ytAuthService.updateCreatorEntry(creatorId, updateDto);
  }

  @Delete('creator')
  async deleteCreatorEntry(
    @Query('creatorId') creatorId: string,
  ): Promise<string> {
    return this.ytAuthService.deleteCreatorEntry(creatorId);
  }

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
  async getChannelInfo() {
    return this.ytAuthService.getChannelInfo();
  }
}
