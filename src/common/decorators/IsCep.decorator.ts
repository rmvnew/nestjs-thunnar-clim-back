// IsCep.decorator.ts
import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsCepValidation } from './regex/IsCepValidation';



export function IsCep(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isCep',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsCepValidation,
            constraints: [],
        });
    };
}
