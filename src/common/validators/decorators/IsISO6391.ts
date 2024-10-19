import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from "class-validator";

import ISO6391 from "iso-639-1";

export function IsISO6391(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsISO6391",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: (value: any) => ISO6391.validate(value),
        defaultMessage: (args: ValidationArguments) =>
          `${args.property} must be a valid ISO 639-1 code`,
      },
    });
  };
}
