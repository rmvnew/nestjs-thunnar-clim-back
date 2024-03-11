import { EntityBase } from "src/common/common_class/entity_base";
import { MovementItem } from "src/movement_items/entities/movement_item.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(() => MovementItem, movement_items => movement_items.product)
    items: MovementItem[];
}
