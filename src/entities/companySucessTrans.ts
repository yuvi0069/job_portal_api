import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("company_successful_transaction")
export class CompanySucessTrans {
  @PrimaryColumn()
  purchase_uuid!: string;

  @Column()
  plan_uuid!: string;

  @Column()
  company_uuid!: string;

  @Column()
  razorpay_order_id!: string;

  @Column()
  razorpay_payment_id!: string;

  @Column()
  success!: boolean;

  @Column()
  created_at!: Date;
}
