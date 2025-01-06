import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { YtAuthStatus } from '../../domain/enums/yt-auth-status.enum';

@Entity({ name: 'yt_auth' })
export class YtAuthEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'creator_id', type: 'uuid', unique: true })
  creatorId: string;

  @Column({ name: 'access_token', type: 'text', unique: true })
  accessToken: string;

  @Column({ name: 'refresh_token', type: 'text', unique: true })
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: YtAuthStatus,
    default: YtAuthStatus.ACTIVE,
  })
  status: YtAuthStatus;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
