import { YtCreatorStatus } from '../enums/yt-creator-status.enum';

export interface IYtCreatorEntity {
  id?: string;
  creatorId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  status: YtCreatorStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
