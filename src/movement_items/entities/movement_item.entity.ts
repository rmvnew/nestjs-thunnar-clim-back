import { EntityBase } from "src/common/common_class/entity_base";
import { Movement } from "src/moviment/entities/movement.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('TB_MOVEMENT_ITEMS')
export class MovementItem extends EntityBase {

    @PrimaryGeneratedColumn('uuid')
    movement_items_id: string

    @Column()
    movement_items_quantity: number

    @Column({ default: 0 })
    movement_items_quantity_returned: number

    @ManyToOne(() => Movement, movement => movement.items)
    @JoinColumn({ name: 'movement_items_moviment_id' })
    movement: Movement

    @ManyToOne(() => Product, product => product.items)
    @JoinColumn({ name: 'movement_items_product_id' })
    product: Product

}
