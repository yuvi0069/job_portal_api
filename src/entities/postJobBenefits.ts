import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity({ name: "post_job_benefits" })
export class PostJobBenefit {
  @PrimaryColumn("uuid")
  job_benefits_id!: string;

  @Column({ type: "int", nullable: true })
  job_id!: number | null;

  @Column({ type: "varchar", nullable: true })
  job_benefit_name!: string | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
