// health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { PrometheusService } from './prometheus.service';

@Module({
  imports: [
    ConfigModule,
    TerminusModule.forRoot({
      logger: true,
      errorLogStyle: 'pretty',
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [HealthController],
  providers: [PrometheusService],
})
export class HealthModule {}
