// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyGuard } from './x-api-key/x-api-key.guard';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      // we will only decode the code and get user context in future
    }),
  ],
  providers: [ApiKeyGuard],
  exports: [ApiKeyGuard, JwtModule],
})
export class AuthModule {}
