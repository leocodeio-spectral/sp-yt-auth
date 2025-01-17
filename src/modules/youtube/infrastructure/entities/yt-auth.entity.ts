import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { YtCreatorStatus } from '../../domain/enums/yt-creator-status.enum';

@Entity({ name: 'yt_auth' })
export class YtAuthEntity {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column({ name: 'creator_id', type: 'uuid', unique: true })
  creatorId: string;

  @Column({ name: 'access_token', type: 'text', unique: true })
  accessToken: string;

  @Column({ name: 'refresh_token', type: 'text', unique: true })
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: YtCreatorStatus,
    default: YtCreatorStatus.ACTIVE,
  })
  status: YtCreatorStatus;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
