import { YtCreatorStatus } from './yt-creator-status.enum';

export type GetCreatorEntryModel = {
  creatorId?: string;
  status?: YtCreatorStatus;
};
