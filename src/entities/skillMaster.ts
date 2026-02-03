import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity({ name: "skill_master" })
export class SkillMaster {
  @PrimaryColumn()
  skill_id!: number;

  @Column({})
  skill_category_id!: number;

  @Column({ type: "varchar" })
  skill_name!: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
