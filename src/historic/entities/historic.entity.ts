import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('TB_HISTORIC')
export class Historic {

    @PrimaryGeneratedColumn('uuid')
    historic_id: string

    @Column({ nullable: false })
    historic_department: string

    @Column({ nullable: false })
    historic_occurrence: string

    @Column({ type: 'datetime' })
    historic_date: string

    @ManyToOne(() => UserEntity, user => user.historics)
    @JoinColumn({
        name: 'user_id'
    })
    user: UserEntity


}
