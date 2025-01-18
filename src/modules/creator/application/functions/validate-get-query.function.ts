import { BadRequestException } from '@nestjs/common';
import { GetCreatorEntryModel } from '../../domain/enums/get-creator-entry.model';
import { YtCreatorStatus } from '../../domain/enums/yt-creator-status.enum';

export const validateGetQuery = (query: GetCreatorEntryModel) => {
  if (
    (query.creatorId === '' || query.creatorId === undefined) &&
    query.status === undefined
  ) {
    return {};
  }
  if (query.status === undefined) {
    return {
      creatorId: query.creatorId,
    };
  }
  if (!YtCreatorStatus[query.status]) {
    throw new BadRequestException(
      'status should be one of this status: ' + Object.keys(YtCreatorStatus),
    );
  }
  if (query.creatorId === '' || query.creatorId === undefined) {
    return {
      status: query.status,
    };
  }
  return {
    id: query.creatorId,
    status: query.status,
  };
};
