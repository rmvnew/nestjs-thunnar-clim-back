import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';

export class CreateUserDto {

    @ApiProperty()
    @Length(5, 50, { message: 'O Nome deve ter entre 5 e 50 caracteres.' })
    user_name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'O email não pode estar vazio.' })
    user_email: string;

    @ApiProperty()
    @Matches(/^(?!([0-9])\1+$)[1-9]{2}9?[0-9]{8}$/, { message: 'O número de telefone deve ser válido e não deve conter todos os dígitos iguais.' })
    user_phone: string;

    @ApiProperty()
    @Length(5, 15, { message: 'A senha deve ter entre 5 e 15 caracteres.' })
    user_password: string;

    @ApiProperty()
    user_profile_id: string;

    @ApiProperty()
    user_date_of_birth: string;

    @IsOptional()
    address?: CreateAddressDto;


}
