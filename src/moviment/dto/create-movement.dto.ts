import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsOptional } from "class-validator"
import { TypeCondition } from "src/common/Enums"


export class CreateMovementDto {

    @ApiProperty()
    user_id: string

    @ApiProperty()
    client_id: string

    @ApiProperty({ required: false, enum: TypeCondition })
    @IsOptional()
    @IsEnum(TypeCondition)
    movement_condition?: string

}
