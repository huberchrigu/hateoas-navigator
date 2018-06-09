// @dynamic
export class ValueConverter<D, A, O> {

  static STRING_CONCAT_FUNCTION = (delimiter: string) => (a, b) => a + delimiter + b;

  private static BYPASS_FUNCTION = x => x;

  constructor(private dateConversionFunction: (value: string) => D,
              private arrayConversionFunction: (array: Array<any>) => A = ValueConverter.BYPASS_FUNCTION,
              private objectConversionFunction: (object: Object) => O = ValueConverter.BYPASS_FUNCTION) {

  }

  transform(value: Array<any> | Object | string | number): string | number | D | A | O {
    if (!value) {
      return value as undefined;
    }
    if (Array.isArray(value)) {
      const array = value.map(item => this.transform(item));
      return this.arrayConversionFunction(array);
    } else if (typeof value === 'object') {
      const transformedObject = {};
      Object.keys(value).forEach(key => {
        transformedObject[key] = this.transform(value[key]);
      });
      return this.objectConversionFunction(transformedObject);
    } else if (typeof value === 'string') {
      const date = this.dateConversionFunction(value);
      if (date) {
        return date;
      }
      return value;
    }
    return value;
  }
}
