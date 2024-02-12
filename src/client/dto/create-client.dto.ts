import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, Length, ValidateIf } from "class-validator"
import { CreateAddressDto } from "src/address/dto/create-address.dto"
import { IsCnpj } from "src/common/decorators/IsCnpj.decorator"
import { IsCpf } from "src/common/decorators/IsCpf.decorator"


export class CreateClientDto {


    @ApiProperty()
    @IsNotEmpty()
    @Length(5, 50, { message: 'O Nome deve ter entre 5 e 50 caracteres.' })
    client_name: string

    @ApiProperty()
    @ValidateIf(data => data.client_cnpj != null)
    @IsCnpj({ message: 'O CNPJ não é válido!' })
    client_cnpj?: string

    @ApiProperty()
    @ValidateIf(data => data.client_cpf != null)
    @IsCpf({ message: 'O CPF não é válido!' })
    client_cpf?: string

    @ApiProperty()
    client_phone: string

    @ApiProperty()
    client_email: string

    @ApiProperty()
    client_responsible: string

    @ApiProperty()
    client_is_company: boolean


    @IsOptional()
    address?: CreateAddressDto

}
