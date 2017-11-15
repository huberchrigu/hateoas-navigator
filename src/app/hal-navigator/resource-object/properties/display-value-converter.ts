import {ValueConverter} from '@hal-navigator/resource-object/properties/value-converter';
import {DateConverter} from '@hal-navigator/resource-object/properties/date-converter';

export class DisplayValueConverter extends ValueConverter<string, string, string> {

  private dateConverter: DateConverter = new DateConverter();

  private static readonly ARRAY_TO_STRING_FUNCTION = (array: Array<any>) => array.length > 0 ?
    array.reduce(ValueConverter.STRING_CONCAT_FUNCTION('; ')) :
    '';

  private static readonly OBJECT_TO_STRING_FUNCTION = (object: Object) => Object.keys(object)
    .map(key => key + ': ' + object[key])
    .reduce(ValueConverter.STRING_CONCAT_FUNCTION(', '));

  constructor() {
    super((value: string) => this.dateConverter.parseAndFormat(value),
      DisplayValueConverter.ARRAY_TO_STRING_FUNCTION,
      DisplayValueConverter.OBJECT_TO_STRING_FUNCTION);
  }
}
