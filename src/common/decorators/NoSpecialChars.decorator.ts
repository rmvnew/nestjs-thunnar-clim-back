import { registerDecorator, ValidationOptions } from 'class-validator';
import { NoSpecialCharsValidation } from './regex/NoSpecialCharsValidation';

export function NoSpecialChars(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'noSpecialChars',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: NoSpecialCharsValidation,
            constraints: [],
        });
    };
}
