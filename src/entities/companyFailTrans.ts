import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("company_failed_payments")
export class CompanyFailedTrans {
  @PrimaryGeneratedColumn()
  company_uuid!: string;

  @Column()
  plan_uuid!: string;

  @Column()
  razorpay_order_id!: string;

  @Column()
  razorpay_payment_id!: string;

  @Column()
  success!: boolean;

  @Column()
  created_at!: Date;
}
