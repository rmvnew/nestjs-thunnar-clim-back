import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";




@Entity('TB_PROFILE')
export class ProfileEntity {

    @PrimaryGeneratedColumn('uuid')
    profile_id: string

    @Column()
    profile_name: string

    @OneToMany(() => UserEntity, (user) => user.profile)
    users: UserEntity[];

}