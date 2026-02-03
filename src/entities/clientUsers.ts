import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToOne,
  OneToMany,
} from "typeorm";
import { IsEmail, Length } from "class-validator";
import { v4 as uuidv4 } from "uuid";
import { CompanyProfiles } from "./companyProfiles";
import { Postjobs } from "./postjobs";

@Entity("client_users")
export class ClientUsers {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  user_uuid!: string;

  @Column({ type: "int" })
  otp: number | null = null;

  @Column()
  @Length(2, 50)
  full_name!: string;

  @Column({ unique: true })
  mobile_number!: string;

  @Column()
  country_code!: string;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column({ nullable: true, type: "uuid" })
  deletedBy?: string;

  @Column()
  password!: string;

  @Column()
  designation!: string;

  @Column({ type: "varchar", nullable: true })
  token!: string | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_date!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_date!: Date;

  @Column({ type: "timestamp", nullable: true })
  deleted_date?: Date;

  @Column({ type: "timestamp", nullable: true })
  restore_date?: Date;

  @Column({ type: "int" })
  deactivated!: number;

  @Column({ type: "uuid" })
  restoredby!: string;

  @Column({ type: "uuid" })
  plan_uuid!: string;

  @Column({ type: "varchar" })
  purchase_plan_status!: string;

  @Column({ type: "int" })
  purchase_plan_remaining_days!: number;

  @Column({ type: "uuid" })
  purchase_plan_uuid!: string;

  @Column({ type: "timestamp" })
  purchased_plan_expiry!: Date;

  public plan_name?: string | null;

  @BeforeInsert()
  generateUUID() {
    this.user_uuid = uuidv4();
  }

  @OneToOne(
    () => CompanyProfiles,
    (companyProfile) => companyProfile.client_user,
    {
      cascade: true,
    }
  )
  company_profile!: CompanyProfiles;

  @OneToMany(() => Postjobs, (postJob) => postJob.clientUser)
  postJobs!: Postjobs[];
}
