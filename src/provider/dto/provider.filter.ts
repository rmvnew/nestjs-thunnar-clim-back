import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/common/pagination/pagination.default.filter";


export class ProviderFilter extends FilterPagination {

    @ApiProperty({ required: false })
    provider_name: string

    @ApiProperty({ required: false })
    showActives?: 'true' | 'false';
}