import { LoggerService, LoggingModule } from '@leocodeio-njs/njs-logging';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEntryDto } from '../../application/dtos/create-entry.dto';
import { UpdateEntryDto } from '../../application/dtos/update-entry.dto';
import { YtAuthService } from '../../application/services/yt-auth.service';
import { YtCreatorStatus } from '../../domain/enums/yt-creator-status.enum';
import { IYtCreatorEntity } from '../../domain/models/yt-auth.model';
import { YtAuthController } from './yt-auth.controller';

describe('YtAuthController', () => {
  let ytAuthController: YtAuthController;
  let ytAuthService: YtAuthService;
  const loggingModule = new LoggingModule();
  let logger: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggingModule],
      providers: [YtAuthController, YtAuthService],
    }).compile();

    ytAuthController = module.get<YtAuthController>(YtAuthController);
    ytAuthService = module.get<YtAuthService>(YtAuthService);
    logger = await module.resolve<LoggerService>(LoggerService);
    logger.setLogContext('YtAuthController.Test');
  });

  describe('POST /creator', () => {
    it('should create a new creator', async () => {
      logger.log('Starting test: create new creator');
      const creatorDto = {
        creatorId: '1',
        accessToken: '1',
        refreshToken: '1',
        status: YtCreatorStatus.ACTIVE,
      };
      const expectedResult = { id: '1', ...creatorDto } as IYtCreatorEntity;

      jest
        .spyOn(ytAuthService, 'createCreator')
        .mockResolvedValue(expectedResult);

      const result = await ytAuthController.createCreator(
        creatorDto as CreateEntryDto,
      );
      logger.log({
        message: 'Create creator test completed',
        input: creatorDto,
        output: result,
      });

      expect(result).toBe(expectedResult);
    });
  });

  describe('GET /creator', () => {
    it('should get creator by id and status', async () => {
      logger.log('Starting test: get creator by id and status');
      const query = { id: '1', status: YtCreatorStatus.ACTIVE };
      const expectedResult = {
        id: '1',
        creatorId: '1',
        accessToken: '1',
        refreshToken: '1',
        status: YtCreatorStatus.ACTIVE,
      } as IYtCreatorEntity;

      jest.spyOn(ytAuthService, 'getCreator').mockResolvedValue(expectedResult);

      expect(await ytAuthController.getCreator(query)).toBe(expectedResult);
    });

    it('should get all creators when no params provided', async () => {
      logger.log('Starting test: get all creators');
      const expectedResult = [
        {
          id: '1',
          creatorId: '1',
          accessToken: '1',
          refreshToken: '1',
          status: YtCreatorStatus.ACTIVE,
        },
      ] as IYtCreatorEntity[];

      jest
        .spyOn(ytAuthService, 'getAllCreators')
        .mockResolvedValue(expectedResult);

      expect(await ytAuthController.getCreator({})).toBe(expectedResult);
    });
  });

  describe('PUT /creator/:creatorId', () => {
    it('should update creator by id', async () => {
      logger.log('Starting test: update creator');
      const creatorId = '1';
      const updateDto = { status: YtCreatorStatus.INACTIVE };
      const expectedResult = {
        id: '1',
        creatorId,
        accessToken: '1',
        refreshToken: '1',
        status: YtCreatorStatus.INACTIVE,
      } as IYtCreatorEntity;

      jest
        .spyOn(ytAuthService, 'updateCreator')
        .mockResolvedValue(expectedResult);

      expect(
        await ytAuthController.updateCreator(
          creatorId,
          updateDto as UpdateEntryDto,
        ),
      ).toBe(expectedResult);
    });
  });

  afterEach(() => {
    logger.log('Test completed');
  });
});
