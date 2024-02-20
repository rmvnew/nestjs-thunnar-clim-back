
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';


export class UpdateUserDto {
    @ApiProperty()
    user_name: string

    @ApiProperty()
    user_email: string

    @ApiProperty()
    user_profile_id: string

    @ApiProperty()
    user_date_of_birth: string

    @ApiProperty()
    user_phone: string

    @ApiProperty({ required: false })
    user_rg?: string

    @ApiProperty({ required: false })
    user_cpf?: string

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateAddressDto)
    address?: CreateAddressDto
}
