import { Device } from "src/device/entities/device.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('TB_PART_OR_SERVICE')
export class PartsOrService {

    @PrimaryGeneratedColumn('uuid')
    parts_or_service_id: string

    @Column()
    parts_or_service_name: string

    @Column()
    parts_or_service_value: number

    @Column()
    parts_or_service_quantity: number

    @ManyToOne(() => Product, product => product.parts_or_services)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Device, device => device.parts_or_services)
    @JoinColumn({ name: 'device_id' })
    device: Device


}
