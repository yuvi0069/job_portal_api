import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { Users } from "./user";

@Entity("user_details")
export class UserDetails {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Users, (user) => user.details, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_uuid", referencedColumnName: "uuid" })
  user!: Users;

  @Column("uuid")
  user_uuid!: string;

  @Column("text")
  profile_pic?: string;

  @Column("text", { array: true })
  languages_spoken!: string[];

  // @Column({ type: "jsonb", nullable: true })
  // skills!: Record<string, any>[];

  @Column({ type: "varchar", length: 255, nullable: true })
  city?: string;

  @Column({ type: "text", nullable: true })
  about_you!: string;

  // @Column({ type: "jsonb", nullable: true })
  // education!: Record<string, any>[];

  @Column({ type: "varchar", length: 255, nullable: true })
  cv_url?: string;

  // @Column({ type: "boolean", default: true })
  // is_fresher!: boolean;

  // @Column({ type: "jsonb", nullable: true })
  // experience!: Record<string, any>[];

  // @Column({ type: "jsonb", nullable: true })
  // social_media!: Record<string, any>[];

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @Column({ type: "varchar" })
  user_role?: string;

  @Column({ type: "varchar" })
  state?: string;

  @Column({ type: "varchar" })
  country?: string;

  // @Column({ type: "float" })
  // total_experience?: number;

  public application_id?: string;

  public application_status?: string;

  @Column({ type: "text" })
  gender?: string;

  @Column({ type: "text" })
  cv_name?: string;

  @Column({ type: "int" })
  deactivated!: number;

  @Column()
  profile_completion!: number;
}
