import { ApiProperty } from "@nestjs/swagger";


export class CreateMovementItemDto {

    @ApiProperty()
    movement_items_quantity: number

    @ApiProperty()
    movement_items_quantity_returned: number

    @ApiProperty()
    movement_id: string

    @ApiProperty()
    product_id: string


}
