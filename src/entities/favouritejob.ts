import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Postjobs } from "./postjobs";
//
@Entity("user_favourite_jobs")
export class FavouriteJob {
  @PrimaryGeneratedColumn()
  favourite_job_uuid!: string;

  @Column()
  job_id!: number;

  @Column()
  user_uuid!: string;

  @Column()
  created_at!: Date;

  @ManyToOne(() => Postjobs, (posJobs) => posJobs.favJobs)
  @JoinColumn({ name: "job_id", referencedColumnName: "id" })
  postJobs!: Postjobs;
}
