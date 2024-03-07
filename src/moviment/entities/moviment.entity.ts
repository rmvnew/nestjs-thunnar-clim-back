import { Client } from "src/client/entities/client.entity";
import { TypeCondition } from "src/common/Enums";
import { EntityBase } from "src/common/common_class/entity_base";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('tb_moviment')
export class Moviment extends EntityBase {

    @PrimaryGeneratedColumn('uuid')
    moviment_id: string

    @Column({ type: 'enum', enum: TypeCondition, default: TypeCondition.OPEN })
    moviment_condition: string

    @ManyToOne(() => UserEntity, (user) => user.moviments)
    @JoinColumn({ name: 'moviment_user_id' })
    user: UserEntity

    @ManyToOne(() => Client, (client) => client.moviments)
    @JoinColumn({ name: 'moviment_client_id' })
    client: Client

}
