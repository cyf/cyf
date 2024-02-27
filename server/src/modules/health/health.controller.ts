import { Controller, Get } from '@nestjs/common'
import {
  HealthCheckService,
  HttpHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get('http')
  @HealthCheck()
  checkHttp() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ])
  }

  @Get('disk')
  @HealthCheck()
  checkDisk() {
    return this.health.check([
      // The used disk storage should not exceed 50% of the full disk size
      () =>
        this.disk.checkStorage('disk health', {
          thresholdPercent: 0.5,
          path: '/',
        }),
      // The used disk storage should not exceed 250 GB
      () =>
        this.disk.checkStorage('disk health', {
          threshold: 250 * 1024 * 1024 * 1024,
          path: '/',
        }),
    ])
  }

  @Get('memory')
  @HealthCheck()
  checkMemory() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ])
  }
}
