import { Injectable } from '@nestjs/common';
import { Registry, Counter } from 'prom-client';

@Injectable()
export class PrometheusService {
  private readonly registry: Registry;
  private readonly healthCheckCounter: Counter;

  constructor() {
    this.registry = new Registry();

    this.healthCheckCounter = new Counter({
      name: 'health_check_status',
      help: 'Health check status counter',
      labelNames: ['type', 'status'],
      registers: [this.registry],
    });
  }

  recordHealthCheck(type: string, status: string): void {
    this.healthCheckCounter.labels(type, status).inc();
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
