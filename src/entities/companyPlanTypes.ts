import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("company_plans_types")
export class CompanyPlanTypes {
  @PrimaryGeneratedColumn()
  plan_uuid!: string;

  @Column()
  plan_amount!: number;

  @Column()
  plan_name!: string;

  @Column()
  plan_days!: number;

  @Column()
  created_at!: Date;
}
