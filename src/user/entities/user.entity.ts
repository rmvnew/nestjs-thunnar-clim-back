import * as speakeasy from 'speakeasy';
import { Address } from 'src/address/entities/address.entity';
import { EntityBase } from 'src/common/common_class/entity_base';
import { Historic } from 'src/historic/entities/historic.entity';
import { Movement } from 'src/moviment/entities/movement.entity';
import { ProfileEntity } from "src/profile/entities/profile.entity";
import { WorkOrder } from 'src/work-order/entities/work-order.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('TB_USER')
export class UserEntity extends EntityBase {

    @PrimaryGeneratedColumn('uuid')
    user_id: string

    @Column()
    user_name: string

    @Column()
    user_email: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    user_date_of_birth: Date

    @Column({ nullable: true })
    user_phone?: string

    @Column({ nullable: true })
    user_rg?: string

    @Column({ nullable: true })
    user_cpf?: string

    @Column({ nullable: false })
    user_password: string

    @Column()
    user_profile_id: string

    @ManyToOne(() => ProfileEntity, (profile) => profile.users)
    @JoinColumn({ name: 'user_profile_id' })
    profile: ProfileEntity

    @OneToOne(() => Address, { nullable: true, cascade: true, eager: true })
    @JoinColumn({ name: 'address_id' })
    address?: Address

    @OneToMany(() => Historic, historic => historic.user)
    historics: Historic[];

    @OneToMany(() => Movement, movement => movement.user)
    movements: Movement[];

    @OneToMany(() => WorkOrder, workOrder => workOrder.user)
    work_orders: WorkOrder[];

   
}
