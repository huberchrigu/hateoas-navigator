import {ValueConverter} from '@hal-navigator/resource-object/properties/value-converter';
import {DateConverter} from '@hal-navigator/resource-object/properties/date-converter';
import {JsonType} from '@hal-navigator/resource-object/resource-object';
import {ResourceDescriptor} from '@hal-navigator/descriptor/resource-descriptor';
import {AbstractResourceField} from '@hal-navigator/resource-object/abstract-resource-field';

export class ResourceProperty extends AbstractResourceField {
  private dateConverter = new DateConverter();
  private formValueConverter: ValueConverter<Date, Array<any>, Object> = new ValueConverter(
    (value: string) => this.dateConverter.parseToDate(value)
  ) as ValueConverter<Date, Array<any>, Object>;

  constructor(private name: string, private value: JsonType, descriptor: ResourceDescriptor) {
    super();
    this.descriptor = descriptor;
  }

  getName(): string {
    return this.name;
  }

  /**
   * If this property was flagged to be a URI (i.e. it is an embedded resource object), extract the URI.
   * Transform other values otherwise.
   */
  getFormValue(): any {
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
    return this.getArrayValue().map(o => new ResourceProperty(this.name, o, this.descriptor));
  }

  // TODO: Merge together with ResourceObjectAdapter, which does the same.
  getObjectProperties(): ResourceProperty[] {
    if (typeof this.value !== 'object') {
      throw new Error(JSON.stringify(this.value) + ' is not an object!');
    }
    return Object.keys(this.value).map(key => new ResourceProperty(key, this.value[key], this.getSubDescriptor(key)));
  }

  protected toRawProperty(): JsonType {
    return this.value;
  }
}
