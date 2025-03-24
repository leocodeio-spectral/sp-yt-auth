import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { YtCreatorStatus } from '../../domain/enums/yt-creator-status.enum';

@Entity({ name: 'yt_creator' })
export class YtCreatorEntity {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column({ name: 'creator_id', type: 'uuid', unique: true })
  creatorId: string;

  @Column({ name: 'email', type: 'text', unique: true })
  email: string;

  @Column({ name: 'access_token', type: 'text', unique: true })
  accessToken: string;

  @Column({ name: 'refresh_token', type: 'text', unique: true })
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: YtCreatorStatus,
    default: YtCreatorStatus.active,
  })
  status: YtCreatorStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
