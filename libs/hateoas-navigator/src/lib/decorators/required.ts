import 'reflect-metadata';

const requiredMetadataKey = Symbol('Required');

export function Required(target: object, propertyKey: string | symbol, parameterIndex: number) {
  const existingParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingParameters.push(parameterIndex);
  Reflect.defineMetadata(requiredMetadataKey, existingParameters, target, propertyKey);
}

export function Validate(): MethodDecorator {
  return function (target: any, propertyName: string | symbol, descriptor: PropertyDescriptor) {
    const method = descriptor.value!;
    descriptor.value = function (this: any, ...args: any[]) {
      const parameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName as string);
      if (parameters) {
        for (const parameterIndex of parameters) {
          if (parameterIndex >= args.length || args[parameterIndex] === undefined || args[parameterIndex] === null) {
            throw new Error(`Missing argument (index ${parameterIndex}) in ${this.constructor.name}#${String(propertyName)}()`);
          }
        }
      }
      return method.apply(this, args);
    };
    return descriptor;
  };
}
