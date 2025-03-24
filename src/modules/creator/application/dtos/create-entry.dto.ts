import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { YtCreatorStatus } from '../../domain/enums/yt-creator-status.enum';
import { BaseDto } from '../../../common/dto/base.dto';

export class CreateEntryDto extends BaseDto {
  @ApiProperty({
    description: 'Creator email',
    example: 'example@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

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
    enum: YtCreatorStatus,
    example: YtCreatorStatus.active,
  })
  @IsEnum(YtCreatorStatus)
  @IsNotEmpty()
  status: YtCreatorStatus;
}
