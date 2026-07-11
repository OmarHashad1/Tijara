import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchFields', async: false })
export class MatchFields<T = any> implements ValidatorConstraintInterface {
  validate(value: T, args: ValidationArguments) {
    return value == args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `Failed to match between ${args.property} and ${args.constraints}`;
  }
}

export function IsMatch(
  constraints: string[] = [],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints,
      validator: MatchFields,
    });
  };
}
