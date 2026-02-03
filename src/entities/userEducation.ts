import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity({ name: "user_education_details" })
export class UserEducation {
  @PrimaryColumn("uuid")
  education_uuid!: string;

  @Column({})
  user_uuid!: string;

  @Column({ type: "varchar" })
  basic_education!: string;

  @Column({ type: "varchar" })
  academy!: string;

  @Column({ type: "varchar" })
  certificate_name!: string;

  @Column({ type: "varchar" })
  specialization!: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;
}
