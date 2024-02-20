import { registerDecorator, ValidationOptions } from 'class-validator';
import { PhoneValidation } from './regex/PhoneValidation';

export function IsValidPhone(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidPhone',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: PhoneValidation,
            constraints: [],
        });
    };
}
