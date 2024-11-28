/**
 *
 * @param messageFactory Function that creates the error messages with the given object (this) and arguments.
 * @throws an error if the return value is empty.
 */
export function NotNull(messageFactory?: (obj: any, args: any[]) => string): MethodDecorator {
  return notNullFunction;

  function notNullFunction(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const oldMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const returnValue: any = oldMethod.apply(this, args);
      if (returnValue) {
        return returnValue;
      }
      const errorMessage = messageFactory ?
        messageFactory(this, args) :
        `Method ${propertyKey as string}() in ${this.constructor.name} returned null value for arguments "${JSON.stringify(args)}"`;
      throw new Error(errorMessage);
    };
    return descriptor;
  }
}
