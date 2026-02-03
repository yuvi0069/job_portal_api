 import { Entity, PrimaryColumn, Column, BeforeInsert, OneToOne,ManyToOne,JoinColumn } from 'typeorm';
 
 import { v4 as uuidv4 } from 'uuid';
 import { Postjobs } from './postjobs';
import { Users } from './user';
 
 @Entity('job_applications')
 export class JobApplication {
 @PrimaryColumn({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  application_id!: string;
 
 @Column({type:'text'})
 application_status?:string;

  @Column({ type: 'uuid' })
  employer_uuid!: string;
 
  @Column({ type: 'uuid'})
  job_seeker_uuid!: string;
 
  @Column({ type: 'int'})
  job_id!: number;
 
@Column ({type:'date'})
appiled_at?:Date

@Column({type:'int'})
user_deactivated!:number

@ManyToOne(() => Postjobs, (postjob) => postjob.jobApplications)
  @JoinColumn({ name: 'job_id' })
  postJob!: Postjobs;

@ManyToOne(()=>Users,(userjobs)=>userjobs.jobs)
@JoinColumn({name:'job_seeker_uuid',referencedColumnName:'uuid'})
userjobs!:Users

  @BeforeInsert()
  generateUUID() {
        this.application_id = uuidv4();
    }

  
 }