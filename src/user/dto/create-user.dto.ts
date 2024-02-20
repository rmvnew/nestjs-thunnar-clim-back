import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, Length, ValidateNested } from 'class-validator';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { IsValidPhone } from 'src/common/decorators/IsValidPhone.decorator';
import { NoSpecialChars } from 'src/common/decorators/NoSpecialChars.decorator';

export class CreateUserDto {

    @ApiProperty()
    @IsNotEmpty()
    @Length(5, 50, { message: 'O Nome deve ter entre 5 e 50 caracteres.' })
    @NoSpecialChars({ message: 'O nome não pode conter caracteres especiais, espaços duplos ou espaços no início/fim.' })
    user_name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'O email não pode estar vazio.' })
    user_email: string;

    @ApiProperty()
    // @Matches(/^(?!([0-9])\1+$)[1-9]{2}9?[0-9]{8}$/, { message: 'O número de telefone deve ser válido e não deve conter todos os dígitos iguais.' })
    @IsValidPhone()
    user_phone: string;

    @ApiProperty()
    @Length(5, 15, { message: 'A senha deve ter entre 5 e 15 caracteres.' })
    user_password: string;

    @ApiProperty()
    user_profile_id: string;

    @ApiProperty()
    user_date_of_birth: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateAddressDto)
    address?: CreateAddressDto


}
