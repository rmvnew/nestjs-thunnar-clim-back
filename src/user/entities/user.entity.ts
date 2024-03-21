import * as speakeasy from 'speakeasy';
import { Address } from 'src/address/entities/address.entity';
import { Historic } from 'src/historic/entities/historic.entity';
import { Movement } from 'src/moviment/entities/movement.entity';
import { ProfileEntity } from "src/profile/entities/profile.entity";
import { WorkOrder } from 'src/work-order/entities/work-order.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('TB_USER')
export class UserEntity {

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

    @Column({ nullable: true })
    user_enrollment?: string

    @Column({ nullable: true })
    user_recovery_code: number

    @Column({ nullable: true })
    user_attempts_to_recover: number

    @Column({ nullable: true })
    user_recovery_date: Date

    @Column({ nullable: true })
    user_2fa_secret: string

    @Column({ default: false })
    user_2fa_active: boolean

    @Column({ nullable: false })
    user_password: string

    @Column()
    user_profile_id: string

    @Column()
    status: boolean

    @Column()
    user_first_access: boolean

    @ManyToOne(() => ProfileEntity, (profile) => profile.users)
    @JoinColumn({ name: 'user_profile_id' })
    profile: ProfileEntity

    @Column({ nullable: true })
    user_refresh_token: string;

    @CreateDateColumn()
    create_at: Date

    @UpdateDateColumn()
    update_at: Date

    @OneToOne(() => Address, { nullable: true, cascade: true, eager: true })
    @JoinColumn({ name: 'address_id' })
    address?: Address

    @OneToMany(() => Historic, historic => historic.user)
    historics: Historic[];

    @OneToMany(() => Movement, movement => movement.user)
    movements: Movement[];

    @OneToMany(() => WorkOrder, workOrder => workOrder.user)
    work_orders: WorkOrder[];

    setTwoFactorSecret() {
        this.user_2fa_secret = speakeasy.generateSecret({ length: 20 }).base32
    }
}
