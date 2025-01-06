import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { PrometheusService } from './prometheus.service';
import { Public } from 'src/common/decorators/auth/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    // private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private readonly configService: ConfigService,
    private readonly prometheusService: PrometheusService,
  ) {}

  @Public()
  @Get('/liveness')
  @HealthCheck()
  @ApiSecurity({ security: [] })
  @ApiOperation({ summary: 'Check if the application is alive' })
  @ApiResponse({
    status: 200,
    description: 'Application is alive and responding to requests',
  })
  @ApiResponse({
    status: 503,
    description: 'Application is not responding properly',
  })
  async checkLiveness() {
    const healthCheck = await this.health.check([
      // Basic application health check
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024), // 150MB

      // Disk space check
      () =>
        this.disk.checkStorage('disk_space', {
          thresholdPercent: 0.9, // 90% threshold
          path: process.platform === 'win32' ? 'C:\\' : '/',
        }),

      // Database connectivity check - simple ping
      // () => this.db.pingCheck('database'),
    ]);

    // Record metrics for monitoring
    this.prometheusService.recordHealthCheck('liveness', healthCheck.status);

    return healthCheck;
  }

  @Public()
  @Get('/readiness')
  @HealthCheck()
  @ApiSecurity({ security: [] })
  @ApiOperation({
    summary: 'Check if the application is ready to accept traffic',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is ready to accept traffic',
  })
  @ApiResponse({
    status: 503,
    description: 'Application is not ready to accept traffic',
  })
  async checkReadiness() {
    const healthCheck = await this.health.check([
      // Database health check
      // () => this.db.pingCheck('database', { timeout: 3000 }),

      // External dependencies health checks (if configured)
      ...this.getExternalHealthChecks(),
    ]);

    // Record metrics for monitoring
    this.prometheusService.recordHealthCheck('readiness', healthCheck.status);

    return healthCheck;
  }

  private getExternalHealthChecks() {
    const externalApis = this.configService.get('EXTERNAL_APIS');
    if (!externalApis) return [];

    try {
      const apis = JSON.parse(externalApis);
      return apis.map(
        (api) => () =>
          this.http.pingCheck(`external_api_${api.name}`, api.url, {
            timeout: 5000,
          }),
      );
    } catch (error) {
      console.error('Failed to parse EXTERNAL_APIS configuration:', error);
      return [];
    }
  }
}
