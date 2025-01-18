import { GetCreatorEntryModel } from '../enums/get-creator-entry.model';
import { IYtCreatorEntity } from '../models/yt-creator.model';

export abstract class IYtCreatorRepository {
  abstract find(query: GetCreatorEntryModel): Promise<IYtCreatorEntity[]>;
  abstract findByEmail(email: string): Promise<IYtCreatorEntity>;
  abstract findById(id: string): Promise<IYtCreatorEntity>;
  abstract save(preferences: IYtCreatorEntity): Promise<IYtCreatorEntity>;
  abstract delete(id: string): Promise<void>;
}
