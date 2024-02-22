import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/common/pagination/pagination.default.filter";


export class ProductFilter extends FilterPagination {

    @ApiProperty({ required: false })
    product_name: string

    @ApiProperty({ required: false })
    showActives?: 'true' | 'false';


}