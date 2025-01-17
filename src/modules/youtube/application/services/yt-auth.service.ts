import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { YtCreatorStatus } from '../../domain/enums/yt-creator-status.enum';
import { IYtCreatorEntity } from '../../domain/models/yt-auth.model';

@Injectable()
export class YtAuthService {
  constructor() {}

  async createCreator(
    creatorDto: Partial<IYtCreatorEntity>,
  ): Promise<IYtCreatorEntity> {
    // Implementation will be added later with repository
    return {
      id: Math.random().toString(36).substr(2, 9),
      creatorId: creatorDto.creatorId,
      accessToken: creatorDto.accessToken,
      refreshToken: creatorDto.refreshToken,
      status: creatorDto.status || YtCreatorStatus.ACTIVE,
    } as IYtCreatorEntity;
  }

  // [TODO] - Make both of this function to be one
  async getCreator(query: {
    id?: string;
    status?: YtCreatorStatus;
  }): Promise<IYtCreatorEntity> {
    // Implementation will be added later with repository
    return {
      id: query.id || '1',
      creatorId: '1',
      accessToken: '1',
      refreshToken: '1',
      status: query.status || YtCreatorStatus.ACTIVE,
    } as IYtCreatorEntity;
  }

  async getAllCreators(): Promise<IYtCreatorEntity[]> {
    // Implementation will be added later with repository
    return [
      {
        id: '1',
        creatorId: '1',
        accessToken: '1',
        refreshToken: '1',
        status: YtCreatorStatus.ACTIVE,
      },
      {
        id: '2',
        creatorId: '2',
        accessToken: '2',
        refreshToken: '2',
        status: YtCreatorStatus.ACTIVE,
      },
    ] as IYtCreatorEntity[];
  }

  async updateCreator(
    creatorId: string,
    updateDto: Partial<IYtCreatorEntity>,
  ): Promise<IYtCreatorEntity> {
    // Implementation will be added later with repository
    return {
      id: creatorId,
      creatorId: '1',
      accessToken: '1',
      refreshToken: '1',
      status: updateDto.status || YtCreatorStatus.ACTIVE,
    } as IYtCreatorEntity;
  }

  async deleteCreator(creatorId: string): Promise<IYtCreatorEntity> {
    // Implementation will be added later with repository
    return {
      id: creatorId,
      creatorId: '1',
    } as IYtCreatorEntity;
  }
}
