import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNotEmpty, IsOptional, Length, ValidateIf, ValidateNested } from "class-validator"
import { CreateAddressDto } from "src/address/dto/create-address.dto"
import { IsCnpj } from "src/common/decorators/IsCnpj.decorator"
import { IsValidPhone } from "src/common/decorators/IsValidPhone.decorator"
import { NoSpecialChars } from "src/common/decorators/NoSpecialChars.decorator"


export class CreateProviderDto {

    @ApiProperty()
    @IsNotEmpty()
    @Length(5, 50, { message: 'O Nome deve ter entre 5 e 50 caracteres.' })
    @NoSpecialChars({ message: 'O nome não pode conter caracteres especiais, espaços duplos ou espaços no início/fim.' })
    provider_name: string

    @ApiProperty()
    @ValidateIf(data => data.client_cnpj != null)
    @IsCnpj({ message: 'O CNPJ não é válido!' })
    provider_cnpj: string

    @ApiProperty()
    @IsNotEmpty()
    @Length(5, 50, { message: 'O Nome deve ter entre 5 e 50 caracteres.' })
    @NoSpecialChars({ message: 'O nome não pode conter caracteres especiais, espaços duplos ou espaços no início/fim.' })
    provider_responsible: string

    @ApiProperty()
    @IsNotEmpty({ message: 'O email não pode estar vazio.' })
    provider_email: string

    @ApiProperty()
    @IsValidPhone()
    provider_phone: string

    @IsOptional()
    @ValidateNested()
    @ApiPropertyOptional({ type: CreateAddressDto })
    @Type(() => CreateAddressDto)
    address?: CreateAddressDto

}
