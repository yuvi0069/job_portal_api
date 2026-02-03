import { Entity,Column,BeforeInsert,PrimaryColumn } from "typeorm";
import { IsEmail } from "class-validator";
import {v4 as uuidv4} from 'uuid';
@Entity('admin')
export class Adminuser{

    @PrimaryColumn({type:'uuid',unique:true})
    uuid!:string;

    @Column({type:'varchar',unique:true})
    @IsEmail()
    email!:string;

    @Column({type:'varchar'})
    mobile_number?:string

    @Column({type:'int4',nullable:true})
    otp?:number|null;

    @Column({type:'varchar'})
    name!:string
    
    
    
    @Column({type:'varchar',nullable:true})
    token!:string|null;
    
    @Column({type:'varchar'})
    password!:string;

    @Column({type:'varchar'})
    type!:string;
    
    @Column({type:'int'})
    deactivated!:number;
    
    @Column({ type: 'uuid'})
  deleted_by!: string;

  @Column({ type: 'timestamp', nullable: true })
    deleted_date?: Date;
     
    @Column({ type: 'timestamp', nullable: true })
    restore_date?: Date;

    @Column({type:'uuid'})
    restoredby!:string

    


    @BeforeInsert()
    generateUUID() {
            this.uuid = uuidv4();
        }
    

}