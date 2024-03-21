import { Client } from "src/client/entities/client.entity";
import { Device } from "src/device/entities/device.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('TB_WORK_ORDER')
export class WorkOrder {

    @PrimaryGeneratedColumn('uuid')
    work_order_id: string

    @Column()
    work_order_number: number

    @Column()
    work_order_value: number

    @Column({ type: 'date' })
    work_order_initial_date: Date

    @Column({ type: 'date' })
    work_order_initial_expected_date: Date

    @Column({ type: 'date' })
    work_order_initial_end_date: Date

    @Column()
    work_order_is_open: boolean

    @Column()
    work_order_responsible: string

    @ManyToOne(() => UserEntity, (user) => user.work_orders)
    @JoinColumn({ name: 'movement_user_id' })
    user: UserEntity

    @ManyToOne(() => Client, (client) => client.work_orders)
    @JoinColumn({ name: 'movement_client_id' })
    client: Client

    @OneToMany(() => Device, device => device.workOrder)
    devices: Device[];









}
