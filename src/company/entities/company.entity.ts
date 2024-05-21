import { Address } from "src/address/entities/address.entity";
import { EntityBase } from "src/common/common_class/entity_base";
import { WorkOrder } from "src/work-order/entities/work-order.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity('TB_COMPANY')
export class Company extends EntityBase {

    @PrimaryGeneratedColumn('uuid')
    company_id: string

    @Column({ unique: true, nullable: false })
    company_name: string

    @Column({ nullable: true })
    trade_name?: string;

    @Column()
    company_cnpj: string

    @Column()
    company_responsible: string

    @Column()
    company_email: string

    @Column()
    company_phone: string

    @Column({ nullable: true })
    state_registration?: string;

    @Column({ nullable: true })
    municipal_registration?: string;

    @OneToOne(() => Address, { nullable: true, cascade: true, eager: true })
    @JoinColumn({ name: 'address_id' })
    address?: Address


    @OneToMany(() => WorkOrder, wOrder => wOrder.company)
    work_orders: WorkOrder[];

}
