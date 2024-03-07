import { Client } from "src/client/entities/client.entity";
import { TypeCondition } from "src/common/Enums";
import { EntityBase } from "src/common/common_class/entity_base";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('tb_movement')
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

}
