import { ApiProperty } from "@nestjs/swagger"

export class CreateWorkOrderDto {

    @ApiProperty()
    work_order_responsible: string

    @ApiProperty()
    user_id: string

    @ApiProperty()
    client_id: string

}
