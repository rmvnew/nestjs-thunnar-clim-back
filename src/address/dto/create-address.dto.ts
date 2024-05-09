import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsCep } from 'src/common/decorators/IsCep.decorator';


export class CreateAddressDto {

    @IsNotEmpty()
    @ApiProperty()
    address_city: string

    @IsNotEmpty()
    @ApiProperty()
    address_district: string

    @IsNotEmpty()
    @ApiProperty()
    address_home_number: string

    @IsNotEmpty()
    @ApiProperty()
    address_state: string

    @IsNotEmpty()
    @ApiProperty()
    address_street: string

    @IsNotEmpty()
    @ApiProperty()
    @IsCep({ message: 'O CEP deve ter 8 dígitos e pode conter um hífen.' })
    address_zipcode: string


}
