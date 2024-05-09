import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, Length } from "class-validator"
import { NoSpecialChars } from "src/common/decorators/NoSpecialChars.decorator"

export class CreateWorkOrderDto {

    @ApiProperty()
    @NoSpecialChars()
    @IsNotEmpty()
    @Length(5, 50, { message: 'O Nome deve ter entre 5 e 50 caracteres.' })
    work_order_responsible: string

    @ApiProperty()
    user_id: string

    @ApiProperty()
    client_id: string

}
