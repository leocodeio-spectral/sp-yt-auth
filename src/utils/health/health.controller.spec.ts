import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      imports: [ConfigModule, TerminusModule, HttpModule],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });
});
