import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("company_saved_candidates")
export class CompanySavedCandidates {
  @PrimaryGeneratedColumn()
  saved_candidates_uuid!: string;

  @Column()
  job_id?: number;

  @Column()
  job_seeker_uuid!: string;

  @Column()
  company_uuid!: string;

  @Column()
  created_at!: Date;
}
