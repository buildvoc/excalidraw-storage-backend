import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { StorageNamespace, StorageService } from '../storage/storage.service';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  namespace = StorageNamespace.SETTINGS;

  constructor(
    private storageService: StorageService,
    private health: HealthCheckService,
    private orm: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get('storage')
  async checkStorage(): Promise<string> {
    const timestamp = new Date().getTime().toString();
    await this.storageService.set(
      'last-health-check',
      timestamp,
      this.namespace,
    );
    return 'healthy';
  }

  @Get('auth')
  @HealthCheck()
  checkAuth(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.orm.pingCheck('db'),
      () => this.memory.checkRSS('mem_rss', 1024 * 2 ** 20 /* 1024 MB */),
    ]);
  }
}
