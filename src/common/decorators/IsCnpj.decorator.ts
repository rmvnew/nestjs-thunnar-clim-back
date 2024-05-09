import { registerDecorator, ValidationOptions } from 'class-validator';
import { CnpjValidation } from './regex/IsCpf_and_IsCNPJ';

export function IsCnpj(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isCnpj',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: CnpjValidation.getInstance(),
        });
    };
}