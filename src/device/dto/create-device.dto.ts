import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional } from "class-validator"


export class CreateDeviceDto {

    @ApiProperty()
    @IsNotEmpty()
    device_brand: string

    @ApiProperty()
    @IsOptional()
    device_invoice_number?: string

    @ApiProperty()
    @IsOptional()
    device_invoice_date?: string

    @ApiProperty()
    @IsNotEmpty()
    device_warranty_status: boolean

    @ApiProperty()
    @IsNotEmpty()
    device_model: string

    @ApiProperty()
    @IsNotEmpty()
    device_serial: string

    @ApiProperty()
    @IsNotEmpty()
    device_defect: string

    @ApiProperty()
    device_note: string

    @ApiProperty()
    work_order_id: string

}
