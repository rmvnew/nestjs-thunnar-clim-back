import { IsNotEmpty } from 'class-validator';
import { IsCep } from 'src/common/decorators/IsCep.decorator';


export class CreateAddressDto {

    @IsNotEmpty()
    address_city: string

    @IsNotEmpty()
    address_district: string

    @IsNotEmpty()
    address_home_number: string

    @IsNotEmpty()
    address_state: string

    @IsNotEmpty()
    address_street: string

    @IsNotEmpty()
    @IsCep({ message: 'O CEP deve ter 8 dígitos e pode conter um hífen.' })
    address_zipcode: string


}
