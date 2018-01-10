import {ValueConverter} from 'app/hal-navigator/hal-resource/property/value-converter';
import {DateConverter} from 'app/hal-navigator/hal-resource/property/date-converter';
import {JsonType} from 'app/hal-navigator/hal-resource/hal-resource';
import {PropertyDescriptor} from 'app/hal-navigator/descriptor/property-descriptor';
import {AbstractProperty} from 'app/hal-navigator/hal-resource/property/abstract-property';

export class ResourceProperty extends AbstractProperty {
  private dateConverter = new DateConverter();
  private formValueConverter: ValueConverter<Date, Array<any>, Object> = new ValueConverter(
    (value: string) => this.dateConverter.parseToDate(value)
  ) as ValueConverter<Date, Array<any>, Object>;

  constructor(name: string, private value: JsonType, descriptor: PropertyDescriptor) {
    super(name, descriptor);
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

  getArrayItems(): ResourceProperty[] {
    return this.getArrayValue().map(o => new ResourceProperty(this.getName(), o, this.descriptor.getArrayItemsDescriptor()));
  }

  protected toRawProperty(): JsonType {
    return this.value;
  }
}
