import { ApiProperty } from "@nestjs/swagger";
import { TypeCondition } from "src/common/Enums";
import { FilterPagination } from "src/common/pagination/pagination.default.filter";




export class MovementFilter extends FilterPagination {

    @ApiProperty({ required: false, enum: TypeCondition })
    // @IsEnum(TypeCondition)
    movement_condition?: string

    @ApiProperty({ required: false })
    showActives?: 'true' | 'false';

    @ApiProperty({ required: false, default: 'DATE', enum: ['DATE', 'LAST_DATE'] })
    orderBy: string = 'DATE'

}