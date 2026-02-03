import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Length } from "class-validator";
import { AppDataSource } from "../config/database";
import { JobApplication } from "./jobApplication";
import { ClientUsers } from "./clientUsers";
import { FavouriteJob } from "./favouritejob";
@Entity("post_jobs")
export class Postjobs {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({})
  user_uuid!: string;

  @Column({})
  admin_posted_uuid!: string;

  // @Column({ nullable: false })
  // company_name?: string;

  @Column({ type: "int" })
  deactivated!: number;

  @Column()
  job_category?: string;

  @Column()
  status?: string;

  @Column()
  @Length(2, 255)
  job_title!: string;

  @Column()
  @Length(2, 255)
  tag?: string;

  @Column()
  job_role!: string;

  @Column()
  gender!: string;

  @Column()
  min_salary!: number;

  @Column()
  max_salary!: number;

  @Column()
  education!: string;

  @Column()
  experience!: string;

  @Column()
  job_type!: string;

  @Column()
  vacancies!: number;

  @Column({ nullable: true })
  expirationDate!: Date;

  @Column()
  job_level!: string;

  @Column()
  state!: string;

  @Column()
  city!: string;

  // @Column()
  // company_logo?: string;

  @Column()
  job_description!: string;

  @Column()
  job_valid_days?: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_date!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_date!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  deleted_date?: Date | null;

  @Column({ type: "varchar" })
  age_group!: string;

  @ManyToOne(() => ClientUsers, (client) => client.postJobs)
  @JoinColumn({ name: "user_uuid", referencedColumnName: "user_uuid" })
  clientUser!: ClientUsers;

  @OneToMany(() => JobApplication, (jobApplication) => jobApplication.postJob)
  jobApplications!: JobApplication[];

  @OneToMany(() => FavouriteJob, (favouriteJob) => favouriteJob.job_id)
  @JoinColumn({ name: "fav_job_id", referencedColumnName: "job_id" })
  favJobs!: FavouriteJob[];

  public job_length!: number;

  public applied!: boolean;

  public favourite!: boolean;
}
