import { Address } from "src/address/entities/address.entity";
import { EntityBase } from "src/common/common_class/entity_base";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('TB_CLIENT')
export class Client extends EntityBase {

    @PrimaryGeneratedColumn('uuid')
    client_id: string

    @Column()
    client_name: string

    @Column({ nullable: true })
    client_cnpj?: string

    @Column({ nullable: true })
    client_cpf?: string

    @Column()
    client_phone: string

    @Column()
    client_email: string

    @Column()
    client_responsible: string

    @Column({ nullable: false, default: true })
    client_is_company: boolean

    @OneToOne(() => Address, { nullable: true, cascade: true, eager: true })
    @JoinColumn({ name: 'address_id' })
    address?: Address


}
