import { ValidatorConstraintInterface, ValidationArguments, ValidationOptions } from 'class-validator';
export declare class NotSame<T = any> implements ValidatorConstraintInterface {
    validate(value: T, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function NotSameAs(constraints?: string[], validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
