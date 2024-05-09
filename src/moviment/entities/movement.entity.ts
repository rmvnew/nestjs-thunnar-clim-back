import { Client } from "src/client/entities/client.entity";
import { TypeCondition } from "src/common/Enums";
import { EntityBase } from "src/common/common_class/entity_base";
import { MovementItem } from "src/movement_items/entities/movement_item.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('TB_MOVEMENT')
export class Movement extends EntityBase {

    @PrimaryGeneratedColumn('uuid')
    movement_id: string

    @Column({ type: 'enum', enum: TypeCondition, default: TypeCondition.OPEN })
    movement_condition: string

    @ManyToOne(() => UserEntity, (user) => user.movements)
    @JoinColumn({ name: 'movement_user_id' })
    user: UserEntity

    @ManyToOne(() => Client, (client) => client.movements)
    @JoinColumn({ name: 'movement_client_id' })
    client: Client

    @OneToMany(() => MovementItem, movement_itens => movement_itens.movement)
    items: MovementItem[];

}
