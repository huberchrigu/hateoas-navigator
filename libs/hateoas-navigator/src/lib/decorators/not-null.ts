/**
 *
 * @param messageFactory Function that creates the error messages with the given object (this) and arguments.
 * @throws an error if the return value is empty.
 */
export function NotNull(messageFactory?: (obj: any, args: any[]) => string): MethodDecorator {
  return notNullFunction as (args: string[]) => any;

  function notNullFunction(target: any, propertyKey: string, descriptor) {
    const oldMethod = descriptor.value;
    descriptor.value = function(...args) {
      const returnValue: any = oldMethod.apply(this, args);
      if (returnValue) {
        return returnValue;
      }
      const errorMessage = messageFactory ?
        messageFactory(this, args) :
        `Method ${propertyKey}() in ${this.constructor.name} returned null value for arguments "${JSON.stringify(args)}"`;
      throw new Error(errorMessage);
    };
    return descriptor;
  }
}
