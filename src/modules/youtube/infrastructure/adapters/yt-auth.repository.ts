import { IYtCreatorEntity } from '../../domain/models/yt-auth.model';
import { CreateEntryDto } from '../../application/dtos/create-entry.dto';
import { IYtAuthRepository } from '../../domain/ports/yt-auth.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { YtAuthEntity } from '../entities/yt-auth.entity';
import { GetCreatorEntryModel } from '../../domain/enums/get-creator-entry.model';

@Injectable()
export class YtAuthRepository implements IYtAuthRepository {
  constructor(
    @InjectRepository(YtAuthEntity)
    private readonly ytAuthRepository: Repository<YtAuthEntity>,
  ) {}

  async find(
    query: GetCreatorEntryModel,
  ): Promise<IYtCreatorEntity[] | IYtCreatorEntity> {
    return this.ytAuthRepository.find({ where: query });
  }

  async save(preferences: IYtCreatorEntity): Promise<IYtCreatorEntity> {
    return this.ytAuthRepository.save(preferences);
  }

  async delete(creatorId: string): Promise<void> {
    await this.ytAuthRepository.delete(creatorId);
  }
}
