import { PartsOrService } from "src/parts-or-service/entities/parts-or-service.entity";
import { WorkOrder } from "src/work-order/entities/work-order.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('TB_DEVICE')
export class Device {

    @PrimaryGeneratedColumn('uuid')
    device_id: string

    @Column()
    device_brand: string

    @Column({ nullable: true })
    device_invoice_number?: string

    @Column({ nullable: true })
    device_invoice_date?: string

    @Column()
    device_warranty_status: boolean

    @Column()
    device_model: string

    @Column()
    device_serial: string

    @Column()
    device_defect: string

    @Column()
    device_note: string

    @Column()
    device_status: boolean

    @ManyToOne(() => WorkOrder, workOrder => workOrder.devices)
    @JoinColumn({ name: 'device_work_order_id' })
    workOrder: WorkOrder

    @OneToMany(() => PartsOrService, partsOrService => partsOrService.device)
    parts_or_services: PartsOrService[];



}
