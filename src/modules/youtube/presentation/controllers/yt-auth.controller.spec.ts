import { LoggerService, LoggingModule } from '@leocodeio-njs/njs-logging';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEntryDto } from '../../application/dtos/create-entry.dto';
import { UpdateEntryDto } from '../../application/dtos/update-entry.dto';
import { YtAuthService } from '../../application/services/yt-auth.service';
import { YtCreatorStatus } from '../../domain/enums/yt-creator-status.enum';
import { IYtCreatorEntity } from '../../domain/models/yt-auth.model';
import { YtAuthController } from './yt-auth.controller';
import { IYtAuthRepository } from '../../domain/ports/yt-auth.repository';
import { YtAuthRepository } from '../../infrastructure/adapters/yt-auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YtAuthEntity } from '../../infrastructure/entities/yt-auth.entity';
import { AppConfigModule, AppConfigService } from '@leocodeio-njs/njs-config';
import { YtAuthModule } from '../../yt-auth.module';
import { GetCreatorEntryModel } from '../../domain/enums/get-creator-entry.model';

describe('YtAuthController', () => {
  let ytAuthController: YtAuthController;
  let ytAuthService: YtAuthService;
  let logger: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggingModule,
        TypeOrmModule.forFeature([YtAuthEntity]),
        TypeOrmModule.forRootAsync({
          imports: [AppConfigModule, YtAuthModule],
          useFactory: (configService: AppConfigService) => ({
            ...configService.databaseConfig,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
          }),
          inject: [AppConfigService],
        }),
      ],
      providers: [
        YtAuthService,
        {
          provide: IYtAuthRepository,
          useClass: YtAuthRepository,
        },
      ],
      controllers: [YtAuthController],
    }).compile();

    ytAuthController = await module.resolve<YtAuthController>(YtAuthController);
    ytAuthService = await module.resolve<YtAuthService>(YtAuthService);
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
        .spyOn(ytAuthService, 'createCreatorEntry')
        .mockResolvedValue(expectedResult);

      const result = await ytAuthController.createCreatorEntry(
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
        status: YtCreatorStatus.ACTIVE,
      };
      const expectedResult = {
        id: '1',
        creatorId: '1',
        accessToken: '1',
        refreshToken: '1',
        status: YtCreatorStatus.ACTIVE,
      } as IYtCreatorEntity;

      jest
        .spyOn(ytAuthService, 'getCreatorEntries')
        .mockResolvedValue(expectedResult);

      expect(
        await ytAuthController.getCreatorEntries(query.creatorId, query.status),
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
          status: YtCreatorStatus.ACTIVE,
        },
      ] as IYtCreatorEntity[];

      jest
        .spyOn(ytAuthService, 'getCreatorEntries')
        .mockResolvedValue(expectedResult);

      expect(await ytAuthController.getCreatorEntries(null, null)).toBe(
        expectedResult,
      );
    });
  });

  describe('PUT /creator', () => {
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
        .spyOn(ytAuthService, 'updateCreatorEntry')
        .mockResolvedValue(expectedResult);

      expect(
        await ytAuthController.updateCreatorEntry(
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
        .spyOn(ytAuthService, 'deleteCreatorEntry')
        .mockResolvedValue(expectedResult);

      expect(await ytAuthController.deleteCreatorEntry(creatorId)).toBe(
        expectedResult,
      );
    });
  });

  afterEach(() => {
    logger.log('Test completed');
  });
});
