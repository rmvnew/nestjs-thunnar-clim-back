import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";


export class CreateMovementItemDto {

    @ApiProperty()
    movement_items_quantity: number

    @ApiProperty()
    @IsOptional()
    movement_items_quantity_returned?: number

    @ApiProperty()
    movement_id: string

    @ApiProperty()
    product_id: string


}
