import { UserEntity } from "src/user/entities/user.entity"

export class CreateHistoricDto {

    historic_department: string
    historic_occurrence: string
    user: UserEntity
    historic_details?: string

}
