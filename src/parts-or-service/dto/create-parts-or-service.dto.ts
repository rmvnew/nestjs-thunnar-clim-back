import { ApiProperty } from "@nestjs/swagger";



export class CreatePartsOrServiceDto {

    @ApiProperty()
    parts_or_service_name: string

    @ApiProperty()
    parts_or_service_value: number

    @ApiProperty()
    parts_or_service_quantity: number

    @ApiProperty()
    product_id: number

    @ApiProperty()
    device_id: number

}
