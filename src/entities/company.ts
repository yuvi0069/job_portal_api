import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail } from 'class-validator';

@Entity()
export class Companys {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    @IsEmail()
    email!: string;

    @Column()
    website!: string;

    @Column()
    phone_number!: number;

    @Column()
    address!: string;

    @Column()
    latitude!: string;

    @Column()
    longitude!: string;

    @Column()
    logo!: string;

    @Column()
    user_uuid!: string;
}
