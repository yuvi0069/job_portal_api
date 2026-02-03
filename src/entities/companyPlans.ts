import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("company_plans")
export class CompanyPlan {
  @PrimaryColumn()
  company_uuid!: string;

  @Column({ unique: true })
  purchase_uuid!: string;

  @Column()
  plan_expiry!: Date;

  @Column()
  plan_uuid!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;
}
