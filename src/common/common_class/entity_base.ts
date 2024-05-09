import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";


export abstract class EntityBase {

    @Column({ name: 'status', default: true })
    status: boolean;

    @CreateDateColumn({ type: 'datetime' })
    created_at: string

    @UpdateDateColumn({ type: 'datetime' })
    updated_at: string

}