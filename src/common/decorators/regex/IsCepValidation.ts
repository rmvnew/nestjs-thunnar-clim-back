// IsCepValidation.ts
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCepValidation implements ValidatorConstraintInterface {
    validate(cep: string, args: ValidationArguments) {


        // Normaliza o CEP removendo espaços e hífen
        const cleanCep = cep.replace(/\D/g, ''); // Remove tudo que não é dígito

        // Verifica se o CEP possui exatamente 8 dígitos
        return cleanCep.length === 8;
    }

    defaultMessage(args: ValidationArguments) {
        // Mensagem padrão de erro
        return 'O CEP deve ter 8 dígitos.';
    }
}
