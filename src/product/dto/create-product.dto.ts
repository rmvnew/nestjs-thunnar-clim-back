import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, Length } from "class-validator"
import { NoSpecialChars } from "src/common/decorators/NoSpecialChars.decorator"


export class CreateProductDto {

    @ApiProperty()
    @NoSpecialChars()
    @IsNotEmpty()
    @Length(5, 50, { message: 'O Nome deve ter entre 5 e 50 caracteres.' })
    product_name: string

    @ApiProperty()
    product_barcode?: string

    @ApiProperty()
    product_code?: string

    @ApiProperty()
    product_ncm?: string

    @ApiProperty()
    product_cfop?: string

    @ApiProperty()
    product_unit_of_measurement: string

    @ApiProperty()
    @IsNumber()
    product_quantity: number

    @ApiProperty()
    @IsNumber()
    product_minimum_stock?: number

    @ApiProperty()
    @IsNumber()
    product_unit_cost?: number

    @ApiProperty()
    @IsNumber()
    product_unit_price?: number
}
