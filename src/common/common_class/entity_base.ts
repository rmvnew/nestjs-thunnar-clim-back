import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";


export abstract class EntityBase {

    @Column({ name: 'status', default: true })
    status: boolean;

    @CreateDateColumn()
    create_at: Date

    @UpdateDateColumn()
    update_at: Date

}