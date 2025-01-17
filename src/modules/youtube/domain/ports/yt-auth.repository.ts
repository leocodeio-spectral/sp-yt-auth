import { GetCreatorEntryModel } from '../enums/get-creator-entry.model';
import { IYtCreatorEntity } from '../models/yt-auth.model';

export abstract class IYtAuthRepository {
  abstract find(
    query: GetCreatorEntryModel,
  ): Promise<IYtCreatorEntity[] | IYtCreatorEntity>;
  abstract save(preferences: IYtCreatorEntity): Promise<IYtCreatorEntity>;
  abstract delete(creatorId: string): Promise<void>;
}
