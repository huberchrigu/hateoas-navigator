const requiredMetadataKey = Symbol('Required');

/**
 * Workaround for angular CLI build issue.
 */
declare const Reflect: any;

export function Required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  const existingParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingParameters.push(parameterIndex);
  Reflect.defineMetadata(requiredMetadataKey, existingParameters, target, propertyKey);

}

export function Validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  const method = descriptor.value;
  descriptor.value = function () {
    const parameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
    if (parameters) {
      for (const parameterIndex of parameters) {
        if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined || arguments[parameterIndex] === null) {
          throw new Error(`Missing argument (index ${parameterIndex}) in ${this.constructor.name}#${propertyName}()`);
        }
      }

    }
    return method.apply(this, arguments);
  };
}
