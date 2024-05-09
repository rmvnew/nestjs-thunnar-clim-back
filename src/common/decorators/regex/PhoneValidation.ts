import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class PhoneValidation implements ValidatorConstraintInterface {
    validate(phone: string, args: ValidationArguments) {
        // Remove espaços, parênteses e hífen para simplificar a verificação de dígitos repetidos
        const cleanPhone = phone.replace(/[\s()-]/g, '');
        // Verifica se o telefone tem 5 ou mais dígitos repetidos consecutivos
        const hasRepeatedDigits = /(.)\1{4,}/.test(cleanPhone);
        // Verifica se o formato geral é válido (DDD opcional, números, com ou sem parênteses, espaços e hífen)
        const isValidFormat = /^\(?\d{2}\)?[-\s]?\d{4,5}[-\s]?\d{4}$/.test(phone);

        return !hasRepeatedDigits && isValidFormat;
    }

    defaultMessage(args: ValidationArguments) {
        return 'O número de telefone deve ser válido, não deve conter cinco ou mais dígitos repetidos consecutivos e deve respeitar os formatos com ou sem parênteses, espaços e hífen.';
    }
}
