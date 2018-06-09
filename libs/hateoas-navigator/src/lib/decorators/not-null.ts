export function NotNull(): MethodDecorator {
  return <(args: string[]) => any> function (target: any, propertyKey: string, descriptor) {
    const oldMethod = descriptor.value;
    descriptor.value = function (...args) {
      const returnValue: any = oldMethod.apply(this, args);
      if (returnValue) {
        return returnValue;
      }
      throw new Error(`Method ${propertyKey}() in ${this.constructor.name} returned null value for arguments "${JSON.stringify(args)}"`);
    };
    return descriptor;
  };
}
