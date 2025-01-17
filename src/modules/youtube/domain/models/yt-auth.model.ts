import { YtCreatorStatus } from '../enums/yt-creator-status.enum';

export interface IYtCreatorEntity {
  id: string;
  creatorId: string;
  accessToken: string;
  refreshToken: string;
  status: YtCreatorStatus;
  createAt: Date;
  updatedAt: Date;
}
