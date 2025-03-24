import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IYtCreatorEntity } from '../../domain/models/yt-creator.model';
import { IYtCreatorRepository } from '../../domain/ports/yt-creator.repository';
import { CreateEntryDto } from '../dtos/create-entry.dto';
import { GetCreatorEntryModel } from '../../domain/enums/get-creator-entry.model';
import { validateGetQuery } from '../functions/validate-get-query.function';
import { UpdateEntryDto } from '../dtos/update-entry.dto';

@Injectable()
export class YtCreatorService {
  private readonly logger = new Logger(YtCreatorService.name);

  constructor(private readonly ytCreatorRepository: IYtCreatorRepository) {}

  // creator functions
  async createCreatorEntry(
    creatorDto: CreateEntryDto,
  ): Promise<IYtCreatorEntity> {
    try {
      this.logger.log(
        'debug log 1 - at ' + __filename.split('/').pop() + ' - creator input:',
        JSON.stringify(creatorDto),
      );
      const creator = await this.ytCreatorRepository.save(creatorDto);
      this.logger.log(
        'debug log 2 - at ' +
          __filename.split('/').pop() +
          ' - creator created:',
        JSON.stringify(creator),
      );
      return creator;
      // return {
      //   id: Math.random().toString(36).substr(2, 9),
      //   creatorId: creatorDto.creatorId,
      //   email: creatorDto.email,
      //   accessToken: creatorDto.accessToken,
      //   refreshToken: creatorDto.refreshToken,
      //   status: creatorDto.status || YtCreatorStatus.ACTIVE,
      // } as IYtCreatorEntity;
    } catch (error) {
      this.logger.error(
        'error log 3 - at ' +
          __filename.split('/').pop() +
          ' - creator creation failed:',
        JSON.stringify(error),
      );
      throw new InternalServerErrorException('Creator not created');
    }
  }
  // [TODO] - Make both of this function to be one
  async getCreatorEntries(
    query: GetCreatorEntryModel,
  ): Promise<IYtCreatorEntity[]> {
    try {
      this.logger.log(
        'debug log 4 - at ' +
          __filename.split('/').pop() +
          ' - searching with query:',
        JSON.stringify(query),
      );
      const validatedQuery: GetCreatorEntryModel = validateGetQuery(query);
      console.log('validatedQuery', validatedQuery);
      const creators = await this.ytCreatorRepository.find(validatedQuery);
      return creators;
      // return {
      //   id: query.id || '1',
      //   creatorId: '1',
      //   accessToken: '1',
      //   refreshToken: '1',
      //   status: query.status || YtCreatorStatus.ACTIVE,
      // } as IYtCreatorEntity;
    } catch (error) {
      this.logger.error(
        'error log 6 - at ' +
          __filename.split('/').pop() +
          ' - creator search failed:',
        JSON.stringify(error),
      );
      throw error;
    }
  }

  async updateCreatorEntry(
    id: string,
    updateDto: UpdateEntryDto,
  ): Promise<IYtCreatorEntity> {
    try {
      if (!id) {
        throw new BadRequestException('Id is required');
      }
      this.logger.log(
        'debug log 7 - at ' +
          __filename.split('/').pop() +
          ' - updating creator:',
        JSON.stringify({ id, updateDto }),
      );
      // find the creator by id
      this.logger.log(
        'debug log 8 - at ' + __filename.split('/').pop() + ' - creator found',
        id,
      );

      const existingCreator = await this.ytCreatorRepository.findById(id);

      if (!existingCreator) {
        // [TODO] - Handle error more efficiently
        this.logger.error(
          'error log 9 - at ' +
            __filename.split('/').pop() +
            ' - Creator not found',
          id,
        );
        throw new NotFoundException('Creator not found');
      }

      if (!existingCreator) {
        // Duplicate error
        // [TODO] - handle multiple creators efficiently
        this.logger.error(
          'error log 10 - at ' +
            __filename.split('/').pop() +
            ' - Multiple creators found',
        );
        throw new Error('Multiple creators found');
      }

      this.logger.log(
        'debug log 11 - at ' + __filename.split('/').pop() + ' - creator found',
        existingCreator,
      );

      // update the creator
      updateDto.status && (existingCreator.status = updateDto.status);
      updateDto.creatorId && (existingCreator.creatorId = updateDto.creatorId);
      updateDto.email && (existingCreator.email = updateDto.email);
      updateDto.accessToken &&
        (existingCreator.accessToken = updateDto.accessToken);
      updateDto.refreshToken &&
        (existingCreator.refreshToken = updateDto.refreshToken);
      existingCreator.updatedAt = new Date();
      // save updated creator
      const creator = await this.ytCreatorRepository.save(existingCreator);
      this.logger.log(
        'debug log 12 - at ' +
          __filename.split('/').pop() +
          ' - creator updated:',
        JSON.stringify(creator),
      );
      // return {
      //   id: creatorId,
      //   creatorId: '1',
      //   accessToken: '1',
      //   refreshToken: '1',
      //   status: updateDto.status || YtCreatorStatus.ACTIVE,
      // } as IYtCreatorEntity;
      return creator;
    } catch (error) {
      this.logger.error(
        'error log 13 - at ' +
          __filename.split('/').pop() +
          ' - creator update failed:',
        JSON.stringify(error),
      );
      throw error;
    }
  }

  async deleteCreatorEntry(id: string): Promise<string> {
    try {
      const isCreatorExist = await this.ytCreatorRepository.findById(id);
      this.logger.log(
        'debug log 13 - at ' +
          __filename.split('/').pop() +
          ' - creator found:',
        JSON.stringify(isCreatorExist),
      );

      if (!isCreatorExist) {
        throw new NotFoundException('Creator not found');
      }

      this.logger.log(
        'debug log 14 - at ' +
          __filename.split('/').pop() +
          ' - deleting creator:',
        id,
      );
      await this.ytCreatorRepository.delete(id);
      this.logger.log(
        'debug log 15 - at ' +
          __filename.split('/').pop() +
          ' - creator deleted:',
        id,
      );
      // return {
      //   id: creatorId,
      //   creatorId: '1',
      // } as IYtCreatorEntity;
      return `Creator with Id ${id} deleted successfully!!!`;
    } catch (error) {
      this.logger.error(
        'error log 16 - at ' +
          __filename.split('/').pop() +
          ' - creator deletion failed:',
        JSON.stringify(error),
      );
      throw error;
    }
  }

  async getCreatorEntryByEmail(email: string): Promise<IYtCreatorEntity> {
    return this.ytCreatorRepository.findByEmail(email);
  }

  async getCreatorEntryById(id: string): Promise<IYtCreatorEntity> {
    return this.ytCreatorRepository.findById(id);
  }
}
