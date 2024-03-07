import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsOptional } from "class-validator"
import { TypeCondition } from "src/common/Enums"


export class CreateMovimentDto {

    @ApiProperty()
    user_id: string

    @ApiProperty()
    client_id: string

    @ApiProperty({ required: false, enum: TypeCondition })
    @IsOptional()
    @IsEnum(TypeCondition)
    moviment_condition?: string

}
