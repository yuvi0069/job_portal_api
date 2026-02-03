import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity({ name: "company_social_media_links" })
export class CompanySocialMedia {
  @PrimaryColumn("uuid")
  social_media_uuid!: string;

  @Column({})
  company_uuid!: string;

  @Column({ type: "varchar" })
  platform!: string;

  @Column({ type: "varchar" })
  url!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
