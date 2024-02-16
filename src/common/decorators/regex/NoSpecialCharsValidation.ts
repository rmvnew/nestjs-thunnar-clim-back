import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: true })
export class NoSpecialCharsValidation implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        const regex = /^(?! )[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+( [A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+)*$/;
        const isValid = regex.test(text);
        return isValid;
    }

    defaultMessage(args: ValidationArguments) {
        return 'O nome do cliente não deve conter caracteres especiais, espaços duplos ou espaços no início/fim.';
    }
}
