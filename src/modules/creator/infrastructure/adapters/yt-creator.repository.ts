import { IYtCreatorEntity } from '../../domain/models/yt-creator.model';
import { IYtCreatorRepository } from '../../domain/ports/yt-creator.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { YtCreatorEntity } from '../entities/yt-creator.entity';
import { GetCreatorEntryModel } from '../../domain/enums/get-creator-entry.model';

@Injectable()
export class YtCreatorRepository implements IYtCreatorRepository {
  constructor(
    @InjectRepository(YtCreatorEntity)
    private readonly ytCreatorRepository: Repository<YtCreatorEntity>,
  ) {}

  async find(query: GetCreatorEntryModel): Promise<IYtCreatorEntity[]> {
    return this.ytCreatorRepository.find({ where: query });
  }

  async save(creator: IYtCreatorEntity): Promise<IYtCreatorEntity> {
    return this.ytCreatorRepository.save(creator);
  }

  async delete(creatorId: string): Promise<void> {
    await this.ytCreatorRepository.delete({ creatorId });
  }
}
