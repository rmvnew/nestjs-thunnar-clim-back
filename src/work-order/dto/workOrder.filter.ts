import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/common/pagination/pagination.default.filter";




export class FilterWorkOrder extends FilterPagination {

    @ApiProperty({ required: false })
    work_order_responsible: string

    @ApiProperty({ required: false })
    showActives?: 'true' | 'false';

}