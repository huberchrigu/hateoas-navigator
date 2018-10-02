import {AbstractProperty} from './abstract-property';
import {DateConverter} from './date-converter';
import {ValueConverter} from './value-converter';
import {JsonType} from '../hal-resource';
import {PropertyDescriptor} from '../../descriptor';

export class ResourceProperty extends AbstractProperty<PropertyDescriptor> {
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

  getObjectProperties(): ResourceProperty[] {
    const value = this.toRawProperty();
    if (typeof value !== 'object') {
      throw new Error(JSON.stringify(value) + ' is not an object!');
    }
    return Object.keys(value).map(key => new ResourceProperty(key, value[key], this.getSubPropertyDescriptor(key)));
  }

  protected toRawProperty(): JsonType {
    return this.value;
  }
}