import { LoggerService, LoggingModule } from '@leocodeio-njs/njs-logging';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEntryDto } from '../../application/dtos/create-entry.dto';
import { UpdateEntryDto } from '../../application/dtos/update-entry.dto';
import { YtCreatorService } from '../../application/services/yt-creator.service';
import { YtCreatorStatus } from '../../domain/enums/yt-creator-status.enum';
import { IYtCreatorEntity } from '../../domain/models/yt-creator.model';
import { YtCreatorController } from './yt-creator.controller';
import { IYtCreatorRepository } from '../../domain/ports/yt-creator.repository';
import { YtCreatorRepository } from '../../infrastructure/adapters/yt-creator.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YtCreatorEntity } from '../../infrastructure/entities/yt-creator.entity';
import { AppConfigModule, AppConfigService } from '@leocodeio-njs/njs-config';
import { YtCreatorModule } from '../../yt-creator.module';
import { GetCreatorEntryModel } from '../../domain/enums/get-creator-entry.model';

describe('YtAuthController', () => {
  let ytCreatorController: YtCreatorController;
  let ytCreatorService: YtCreatorService;
  let logger: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggingModule,
        TypeOrmModule.forFeature([YtCreatorEntity]),
        TypeOrmModule.forRootAsync({
          imports: [AppConfigModule, YtCreatorModule],
          useFactory: (configService: AppConfigService) => ({
            ...configService.databaseConfig,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
          }),
          inject: [AppConfigService],
        }),
      ],
      providers: [
        YtCreatorService,
        {
          provide: IYtCreatorRepository,
          useClass: YtCreatorRepository,
        },
      ],
      controllers: [YtCreatorController],
    }).compile();

    ytCreatorController =
      await module.resolve<YtCreatorController>(YtCreatorController);
    ytCreatorService = await module.resolve<YtCreatorService>(YtCreatorService);
    logger = await module.resolve<LoggerService>(LoggerService);
    logger.setLogContext('YtCreatorController.Test');
  });

  describe('POST /creator', () => {
    it('should create a new creator', async () => {
      logger.log('Starting test: create new creator');
      const creatorDto = {
        creatorId: '1',
        accessToken: '1',
        refreshToken: '1',
        status: YtCreatorStatus.active,
      };
      const expectedResult = { id: '1', ...creatorDto } as IYtCreatorEntity;

      jest
        .spyOn(ytCreatorService, 'createCreatorEntry')
        .mockResolvedValue(expectedResult);

      const result = await ytCreatorController.createCreatorEntry(
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
      const query: GetCreatorEntryModel = {
        creatorId: '1',
        status: YtCreatorStatus.active,
      };
      const expectedResult = [
        {
          id: '1',
          creatorId: '1',
          accessToken: '1',
          refreshToken: '1',
          status: YtCreatorStatus.active,
        },
      ] as IYtCreatorEntity[];

      jest
        .spyOn(ytCreatorService, 'getCreatorEntries')
        .mockResolvedValue(expectedResult);

      expect(
        await ytCreatorController.getCreatorEntries(
          query.creatorId,
          query.status,
        ),
      ).toBe(expectedResult);
    });

    it('should get all creators when no params provided', async () => {
      logger.log('Starting test: get all creators');
      const expectedResult = [
        {
          id: '1',
          creatorId: '1',
          accessToken: '1',
          refreshToken: '1',
          status: YtCreatorStatus.active,
        },
      ] as IYtCreatorEntity[];

      jest
        .spyOn(ytCreatorService, 'getCreatorEntries')
        .mockResolvedValue(expectedResult);

      expect(await ytCreatorController.getCreatorEntries(null, null)).toBe(
        expectedResult,
      );
    });
  });

  describe('PUT /creator', () => {
    it('should update creator by id', async () => {
      logger.log('Starting test: update creator');
      const creatorId = '1';
      const updateDto = { status: YtCreatorStatus.inactive };
      const expectedResult = {
        id: '1',
        creatorId,
        accessToken: '1',
        refreshToken: '1',
        status: YtCreatorStatus.inactive,
      } as IYtCreatorEntity;

      jest
        .spyOn(ytCreatorService, 'updateCreatorEntry')
        .mockResolvedValue(expectedResult);

      expect(
        await ytCreatorController.updateCreatorEntry(
          creatorId,
          updateDto as UpdateEntryDto,
        ),
      ).toBe(expectedResult);
    });
  });

  describe('DELETE /creator', () => {
    it('should delete creator by id', async () => {
      logger.log('Starting test: delete creator');
      const creatorId = '1';
      const expectedResult = `Creator with Id ${creatorId} deleted successfully!!!`;

      jest
        .spyOn(ytCreatorService, 'deleteCreatorEntry')
        .mockResolvedValue(expectedResult);

      expect(await ytCreatorController.deleteCreatorEntry(creatorId)).toBe(
        expectedResult,
      );
    });
  });

  afterEach(() => {
    logger.log('Test completed');
  });
});
