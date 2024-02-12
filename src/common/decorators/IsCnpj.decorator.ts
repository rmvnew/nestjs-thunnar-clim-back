import { registerDecorator, ValidationOptions } from 'class-validator';
import { CnpjValidation } from '../constraints';

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