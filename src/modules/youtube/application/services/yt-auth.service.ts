import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YtAuthService {
  constructor(private configService: ConfigService) {}
}
