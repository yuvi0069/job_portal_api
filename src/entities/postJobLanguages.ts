import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity({ name: "post_job_languages" })
export class PostJobLanguage {
  @PrimaryColumn("uuid")
  job_language_id!: string;

  @Column({ type: "int", nullable: true })
  job_id!: number | null;

  @Column({ type: "varchar", nullable: true })
  language!: string | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    nullable: true,
  })
  updated_at!: Date;
}
