import { EntityBase } from "src/common/common_class/entity_base";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('TB_HISTORIC')
export class Historic extends EntityBase {

    @PrimaryGeneratedColumn('uuid')
    historic_id: string

    @Column({ nullable: false })
    historic_department: string

    @Column({ nullable: false })
    historic_occurrence: string

    @Column({ nullable: true })
    historic_details?: string

    @Column({ type: 'datetime' })
    historic_date: string

    @ManyToOne(() => UserEntity, user => user.historics)
    @JoinColumn({
        name: 'user_id'
    })
    user: UserEntity


}
