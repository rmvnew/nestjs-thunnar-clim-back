import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";


export abstract class EntityBase {

    @Column({ name: 'status', default: true })
    status: boolean;

    @CreateDateColumn({ type: 'datetime' })
    create_at: string

    @UpdateDateColumn({ type: 'datetime' })
    update_at: string

}