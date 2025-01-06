import { YtAuthStatus } from '../enums/yt-auth-status.enum';

export interface IYtAuthEntity {
  id: string;
  creatorId: string;
  accessTokenText: string;
  refreshTokenText: string;
  status: YtAuthStatus;
  createAt: Date;
  updatedAt: Date;
}
