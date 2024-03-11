import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { TypeOperation } from "src/common/Enums";


export class CreateMovementItemDto {

    @ApiProperty()
    movement_items_quantity: number

    @ApiProperty()
    movement_items_quantity_returned: number

    @ApiProperty({ required: false, enum: TypeOperation })
    @IsEnum(TypeOperation)
    movement_items_condition: string

}
