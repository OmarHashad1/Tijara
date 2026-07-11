import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'NotSame', async: false })
export class NotSame<T = any> implements ValidatorConstraintInterface {
  validate(value: T, args: ValidationArguments) {
    return value != args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must not be the same as ${args.constraints[0]}`;
  }
}

export function NotSameAs(
  constraints: string[] = [],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints,
      validator: NotSame,
    });
  };
}
