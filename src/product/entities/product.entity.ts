import { EntityBase } from "src/common/common_class/entity_base";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('TB_PRODUCT')
export class Product extends EntityBase {

    @PrimaryGeneratedColumn('uuid')
    product_id: string

    @Column({ unique: true })
    product_name: string

    @Column({ nullable: true })
    product_barcode?: string

    @Column({ nullable: true })
    product_code?: string

    @Column({ nullable: true })
    product_ncm?: string

    @Column({ nullable: true })
    product_cfop?: string

    @Column()
    product_unit_of_measurement: string

    @Column()
    product_quantity: number

    @Column({ nullable: true })
    product_minimum_stock?: number

    @Column({ nullable: true })
    product_unit_cost?: number

    @Column({ nullable: true })
    product_unit_price?: number

    @Column({ nullable: false })
    can_be_returned?: boolean;
}
