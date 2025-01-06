import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { YtAuthStatus } from '../../domain/enums/yt-auth-status.enum';

export class CreateEntryDto {
  @ApiProperty({
    description: 'Creator UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  creatorId: string;

  @ApiProperty({
    description: 'YouTube access token',
    example: 'ya29.a0AfH6SMBx7-gYj5N...',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: 'YouTube refresh token',
    example: '1//04dXy7-gYj5N...',
  })
  @IsString()
  @IsOptional()
  refreshToken: string;

  @ApiProperty({
    description: 'Authentication status',
    enum: YtAuthStatus,
    example: YtAuthStatus.ACTIVE,
  })
  @IsEnum(YtAuthStatus)
  @IsNotEmpty()
  status: YtAuthStatus;
}
