import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity({ name: "user_skills_details" })
export class UserSkills {
  @PrimaryColumn("uuid")
  skill_uuid!: string;

  @Column({})
  user_uuid!: string;

  @Column({ type: "varchar" })
  skill_name!: string;

  @Column({ type: "varchar" })
  skill_level!: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
