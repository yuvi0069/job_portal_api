import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("company_notification")
export class CompanyNotification {
  @PrimaryColumn({ type: "uuid", default: () => "uuid_generate_v4()" })
  notification_uuid!: string;

  @Column({ type: "uuid" })
  job_seeker_uuid!: string;

  @Column({ type: "uuid" })
  company_uuid!: string;

  @Column({ type: "int" })
  job_id!: number;

  @Column({ type: "bool" })
  isread!: boolean;

  @Column({ type: "int" })
  application_count!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "varchar", length: 255 })
  notification_message!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;
}
