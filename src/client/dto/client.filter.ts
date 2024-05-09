import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/common/pagination/pagination.default.filter";



export class ClientFilter extends FilterPagination {


    @ApiProperty({ required: false })
    client_name: string

    @ApiProperty({ required: false })
    showActives?: 'true' | 'false';

}