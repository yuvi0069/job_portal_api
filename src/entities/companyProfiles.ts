import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { ClientUsers } from "./clientUsers";

@Entity("company_profiles")
export class CompanyProfiles {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => ClientUsers, (clientUser) => clientUser.company_profile)
  @JoinColumn({ name: "client_user_uuid", referencedColumnName: "user_uuid" })
  client_user!: ClientUsers;

  @Column({ unique: true })
  client_user_uuid!: string;

  @Column({ type: "int4" })
  deactivated!: number | undefined;

  @Column()
  company_name!: string;

  @Column({ nullable: true })
  company_logo?: string;
  @Column()
  company_size?: string;
  @Column()
  company_description!: string;

  @Column({ nullable: true })
  company_vision?: string;

  @Column()
  profile_completion!: number;

  @Column({ nullable: true })
  company_industry?: string;

  @Column({ nullable: true })
  company_website?: string;

  @Column({ nullable: true })
  company_location?: string;

  @Column({ nullable: true })
  company_founded_year?: String;

  @Column({ nullable: true })
  company_contact?: string;

  @Column({ nullable: true })
  company_banner?: string;

  // @Column({ type: "jsonb", nullable: true })
  // company_social_media_links!: Record<string, any>[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_date!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_date!: Date;
}
