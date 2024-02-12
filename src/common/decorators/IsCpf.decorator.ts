import { registerDecorator, ValidationOptions } from 'class-validator';
import { CpfValidation } from '../constraints';

export function IsCpf(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isCpf',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: CpfValidation.getInstance(),
        });
    };
}