import { Client } from "src/client/entities/client.entity";
import { EntityBase } from "src/common/common_class/entity_base";
import { TypeCondition } from "src/common/Enums";
import { Device } from "src/device/entities/device.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('TB_WORK_ORDER')
export class WorkOrder extends EntityBase {

    @PrimaryGeneratedColumn('uuid')
    work_order_id: string

    @Column()
    work_order_number: number

    @Column({ nullable: true })
    work_order_value: number

    @Column({ type: 'date' })
    work_order_initial_date: string

    @Column({ type: 'date', nullable: true })
    work_order_initial_expected_date: string

    @Column({ type: 'date', nullable: true })
    work_order_initial_end_date: string

    @Column({
        type: 'enum',
        enum: TypeCondition,
        default: TypeCondition.OPEN,
    })
    work_order_status_condition: TypeCondition;

    @Column()
    work_order_is_open: boolean

    @Column()
    work_order_responsible: string

    @ManyToOne(() => UserEntity, (user) => user.work_orders)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity

    @ManyToOne(() => Client, (client) => client.work_orders)
    @JoinColumn({ name: 'client_id' })
    client: Client

    @OneToMany(() => Device, device => device.workOrder)
    devices: Device[];









}
