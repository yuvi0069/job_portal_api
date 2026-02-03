import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity({ name: "user_social_media" })
export class UserSocialMedia {
  @PrimaryColumn("uuid")
  social_media_uuid!: string;

  @Column({})
  user_uuid!: string;

  @Column({ type: "varchar" })
  platform!: string;

  @Column({ type: "varchar" })
  url!: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
