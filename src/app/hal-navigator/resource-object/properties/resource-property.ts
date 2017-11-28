import {DisplayValueConverter} from '@hal-navigator/resource-object/properties/display-value-converter';
import {ValueConverter} from '@hal-navigator/resource-object/properties/value-converter';
import {DateConverter} from '@hal-navigator/resource-object/properties/date-converter';
import {DataHolder} from '@hal-navigator/resource-object/resource-field';
import {JsonType} from '@hal-navigator/resource-object/resource-object';

export class ResourceProperty implements DataHolder {
  private dateConverter = new DateConverter();
  private displayValueConverter = new DisplayValueConverter();
  private formValueConverter: ValueConverter<Date, Array<any>, Object> = new ValueConverter(
    (value: string) => this.dateConverter.parseToDate(value)
  ) as ValueConverter<Date, Array<any>, Object>;

  constructor(private name: string, private value: JsonType) {
  }

  getName(): string {
    return this.name;
  }

  getDisplayValue(): string | number {
    return this.displayValueConverter.transform(this.value);
  }

  /**
   * If this property was flagged to be a URI (i.e. it is an embedded resource object), extract the URI.
   * Transform other values otherwise.
   */
  getFormValue() {
    return this.formValueConverter.transform(this.value);
  }

  getArrayValue(): Array<JsonType> {
    if (this.isArray()) {
      return this.value as Array<JsonType>;
    } else {
      throw new Error(this.value + ' is not an array');
    }
  }

  isArray(): boolean {
    return Array.isArray((this.value));
  }

  isUriType(): boolean {
    return false;
  }

  getChildren(): ResourceProperty[] {
    return this.getArrayValue().map(o => new ResourceProperty(this.name, o));
  }

  // TODO: Merge together with ResourceObjectAdapter, which does the same.
  getObjectProperties(): ResourceProperty[] {
    if (typeof this.value !== 'object') {
      throw new Error(JSON.stringify(this.value) + ' is not an object!');
    }
    return Object.keys(this.value).map(key => new ResourceProperty(key, this.value[key]));
  }
}
