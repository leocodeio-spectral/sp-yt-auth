import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@leocodeio-njs/njs-auth';
import { ApiSecurity } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiSecurity('x-api-key')
  // @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
