import { Address } from "src/address/entities/address.entity";
import { EntityBase } from "src/common/common_class/entity_base";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('TB_PROVIDER')
export class Provider extends EntityBase {

    @PrimaryGeneratedColumn('uuid')
    provider_id: string

    @Column({ unique: true })
    provider_name: string

    @Column()
    provider_cnpj: string

    @Column()
    provider_responsible: string

    @Column()
    provider_email: string

    @Column()
    provider_phone: string

    @OneToOne(() => Address, { nullable: true, cascade: true, eager: true })
    @JoinColumn({ name: 'address_id' })
    address?: Address

}
