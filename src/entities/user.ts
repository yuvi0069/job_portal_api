import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
  BeforeInsert,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { UserDetails } from "./userDetails";
import { JobApplication } from "./jobApplication";

@Entity("users")
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "uuid", default: () => "uuid_generate_v4()" })
  uuid!: string;

  @Column({ type: "varchar", length: 255, name: "full_name" })
  fullName!: string;

  // @Column({ type: "varchar", length: 255 })
  // last_name!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  password?: string;

  @Column({ type: "varchar", length: 20, unique: true })
  mobile_number!: string;

  @Column({ type: "int", nullable: true })
  otp: number | null = null;

  @Column({ type: "date", nullable: true })
  date_of_birth: Date | null = null;

  @Column({ type: "bool" })
  otp_verified?: Boolean;

  @Column({ type: "bool" })
  ispin!: Boolean;

  @Column({ type: "bool" })
  isadmin_otp!: Boolean;

  @Column({ type: "int" })
  pin?: number | null;

  @Column({ type: "varchar" })
  country_code!: string;

  @Column({ type: "bool" })
  email_verified!: boolean;

  @Column({ type: "varchar" })
  email_token?: string | null;

  @Column({ type: "text", nullable: true })
  token?: string | null;

  @Column({ type: "text", nullable: true })
  state?: string;
  @Column({ type: "text", nullable: true })
  city?: string;

  @Column({ type: "timestamp" })
  email_verified_date?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at!: Date;

  @OneToOne(() => UserDetails, (userDetails) => userDetails.user)
  details!: UserDetails;

  @Column({ type: "int" })
  deactivated!: number;

  @Column({ type: "uuid" })
  deleted_by!: string;

  @Column({ type: "timestamp", nullable: true })
  deleted_date?: Date;

  @Column({ type: "timestamp", nullable: true })
  restore_date?: Date;

  @Column({ type: "uuid" })
  restoredby!: string;

  @OneToMany(() => JobApplication, (job) => job.userjobs)
  @JoinColumn({ name: "user_uuid", referencedColumnName: "job_seeker_uuid" })
  jobs!: JobApplication[];

  @BeforeInsert()
  generateUUID() {
    this.uuid = uuidv4();
  }
}
