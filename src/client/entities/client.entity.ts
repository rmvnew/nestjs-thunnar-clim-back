import { Address } from "src/address/entities/address.entity";
import { EntityBase } from "src/common/common_class/entity_base";
import { Movement } from "src/moviment/entities/movement.entity";
import { WorkOrder } from "src/work-order/entities/work-order.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('TB_CLIENT')
export class Client extends EntityBase {

    @PrimaryGeneratedColumn('uuid')
    client_id: string

    @Column({ unique: true })
    client_name: string

    @Column({ nullable: true, unique: true })
    client_cnpj?: string

    @Column({ nullable: true, unique: true })
    client_cpf?: string

    @Column({ unique: true })
    client_phone: string

    @Column({ unique: true })
    client_email: string

    @Column()
    client_responsible: string

    @Column({ nullable: false, default: true })
    client_is_company: boolean

    @OneToOne(() => Address, { nullable: true, cascade: true, eager: true })
    @JoinColumn({ name: 'address_id' })
    address?: Address

    @OneToMany(() => Movement, movement => movement.user)
    movements: Movement[];

    @OneToMany(() => WorkOrder, workOrder => workOrder.client)
    work_orders: WorkOrder[];


}
