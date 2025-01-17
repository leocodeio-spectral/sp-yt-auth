import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { YtAuthService } from '../../application/services/yt-auth.service';
import { YtCreatorStatus } from '../../domain/enums/yt-creator-status.enum';
import { CreateEntryDto } from '../../application/dtos/create-entry.dto';
import { UpdateEntryDto } from '../../application/dtos/update-entry.dto';
import { IYtCreatorEntity } from '../../domain/models/yt-auth.model';

@Controller('youtube/auth')
export class YtAuthController {
  constructor(private readonly ytAuthService: YtAuthService) {}

  @Post('creator')
  async createCreator(
    @Body() creatorDto: CreateEntryDto,
  ): Promise<IYtCreatorEntity> {
    return this.ytAuthService.createCreator(creatorDto);
  }

  @Get('creator')
  async getCreator(
    @Query()
    query: {
      id?: string;
      status?: YtCreatorStatus;
    },
  ): Promise<IYtCreatorEntity[] | IYtCreatorEntity> {
    if (Object.keys(query).length === 0) {
      return this.ytAuthService.getAllCreators();
    }
    return this.ytAuthService.getCreator(query);
  }

  @Put('creator/:creatorId')
  async updateCreator(
    @Param('creatorId') creatorId: string,
    @Body() updateDto: UpdateEntryDto,
  ): Promise<IYtCreatorEntity> {
    return this.ytAuthService.updateCreator(creatorId, updateDto);
  }

  @Delete('creator/:creatorId')
  async deleteCreator(
    @Param('creatorId') creatorId: string,
  ): Promise<IYtCreatorEntity> {
    return this.ytAuthService.deleteCreator(creatorId);
  }
}
