import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity({ name: "user_experience_details" })
export class UserExperience {
  @PrimaryColumn("uuid")
  experience_uuid!: string;

  @Column({})
  user_uuid!: string;

  @Column({ type: "varchar" })
  company_name!: string;

  @Column({ type: "varchar" })
  experience_years!: string;

  @Column({ type: "varchar" })
  city!: string;

  @Column({ type: "varchar" })
  job_title!: string;

  @Column({ type: "varchar" })
  is_working!: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
