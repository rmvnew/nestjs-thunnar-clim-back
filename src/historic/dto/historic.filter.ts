import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/common/pagination/pagination.default.filter";




export class HistoricFilter extends FilterPagination {

    @ApiProperty({ required: false })
    user_name: string

}