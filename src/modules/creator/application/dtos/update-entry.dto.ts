import { IsEnum, IsNotEmpty } from 'class-validator';
import { BaseDto } from '../../../common/dto/base.dto';
import { IsOptional, IsString } from 'class-validator';
import { YtCreatorStatus } from '../../domain/enums/yt-creator-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEntryDto extends BaseDto {
  @ApiProperty({
    description: 'YouTube creator id',
    example: '11111111-1111-1111-1111-111111111111',
  })
  @IsString()
  @IsOptional()
  creatorId: string;

  @ApiProperty({
    description: 'YouTube creator email',
    example: 'test@test.com',
  })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'YouTube access token',
    example: 'ya29.a0AfH6SMBx7-gYj5N...',
  })
  @IsString()
  @IsOptional()
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
    enum: YtCreatorStatus,
    example: YtCreatorStatus.active,
  })
  @IsEnum(YtCreatorStatus)
  @IsNotEmpty()
  status: YtCreatorStatus;
}
